import SubCategoryWrapper from '@/components/categories/SubCategoryWrapper'
export default async function Page({ params }) {
    const id = await params.id;
    return (
        <SubCategoryWrapper id={id} />
    )
}
