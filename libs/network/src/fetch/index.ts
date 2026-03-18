import { TypedDocumentNode } from '@apollo/client/core/types'
import { print } from 'graphql'

export interface FetchResult<TData> {
  data?: TData
  error?: string
}

export interface GraphqlRequestOptions<TData, V> {
  document: TypedDocumentNode<TData, V>
  variables?: V
  config?: RequestInit
  token?: string
}

/**
 * Sends a GraphQL request and returns the response data.
 *
 * @param {TypedDocumentNode<TData, V>} document - The GraphQL query/mutation document.
 * @param {V} [variables] - The variables for the GraphQL query/mutation.
 * @param {RequestInit} [config] - Optional configuration for the fetch request.
 *
 * @returns {Promise<FetchResult<TData>>} The result of the GraphQL request.
 */
export async function fetchGraphQL<TData, V>({
  document,
  variables,
  config,
  token,
}: GraphqlRequestOptions<TData, V>): Promise<FetchResult<TData>> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    return { error: 'NEXT_PUBLIC_API_URL is not configured' }
  }

  const query = print(document)

  try {
    const res = await fetch(apiUrl + '/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : null),
      },
      body: JSON.stringify({ query, variables }),
      ...config,
    })

    const rawResponse = await res.text()
    if (!rawResponse) {
      return {
        error: `Empty response from GraphQL API (status ${res.status})`,
      }
    }

    let parsedResponse: { data?: TData; errors?: Array<{ message?: string }> }
    try {
      parsedResponse = JSON.parse(rawResponse)
    } catch {
      return {
        error: `Invalid GraphQL response: ${rawResponse.slice(0, 160)}`,
      }
    }

    const firstError = parsedResponse.errors?.[0]?.message
    if (!res.ok) {
      return {
        error:
          firstError || `GraphQL API request failed with status ${res.status}`,
      }
    }

    if (firstError) {
      return { error: firstError }
    }

    return { data: parsedResponse.data }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' }
  }
}
