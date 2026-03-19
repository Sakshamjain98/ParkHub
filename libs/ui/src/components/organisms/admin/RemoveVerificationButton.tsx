import { useMutation } from '@apollo/client'
import {
  RemoveVerificationDocument,
  namedOperations,
} from '@ParkHub/network/src/gql/generated'
import { Button } from '../../atoms/Button'

export const RemoveVerificationButton = ({
  garageId,
}: {
  garageId: number
}) => {
  const [removeVerification, { loading }] = useMutation(
    RemoveVerificationDocument,
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
      className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-red-700"
      onClick={async () => {
        await removeVerification({
          variables: {
            where: {
              garageId,
            },
          },
        })
      }}
    >
      Unlist
    </Button>
  )
}
