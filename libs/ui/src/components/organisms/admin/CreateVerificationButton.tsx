import { useMutation } from '@apollo/client'
import {
  CreateVerificationDocument,
  namedOperations,
} from '@ParkHub/network/src/gql/generated'
import { Button } from '../../atoms/Button'

export const CreateVerificationButton = ({
  garageId,
}: {
  garageId: number
}) => {
  const [createVerification, { loading }] = useMutation(
    CreateVerificationDocument,
    {
      awaitRefetchQueries: true,
      refetchQueries: [namedOperations.Query.Garages],
    },
  )

  return (
    <Button
      size="none"
      variant="text"
      loading={loading}
      className="rounded-full border border-green-300 bg-green-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-green-700"
      onClick={async () => {
        await createVerification({
          variables: {
            createVerificationInput: {
              garageId,
              verified: true,
            },
          },
        })
      }}
    >
      Verify
    </Button>
  )
}
