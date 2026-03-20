import { useTakeSkip } from '@ParkHub/util/hooks/pagination'
import { useQuery } from '@apollo/client'
import { CompanyValetsDocument } from '@ParkHub/network/src/gql/generated'
import { ShowData } from './ShowData'
import { ValetCard } from './ValetCard'

export const ListValets = () => {
  const { take, skip, setSkip, setTake } = useTakeSkip()
  const { data, loading } = useQuery(CompanyValetsDocument)

  return (
    <ShowData
      loading={loading}
      pagination={{
        resultCount: data?.companyValets.length,
        totalCount: data?.companyValetsTotal,
        take,
        skip,
        setSkip,
        setTake,
      }}
      childrenClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-3"
      title="Valets"
    >
      {data?.companyValets.map((valet) => (
        <ValetCard key={valet.uid} valet={valet} />
      ))}
    </ShowData>
  )
}
