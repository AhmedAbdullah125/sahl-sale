import CategoryWrapper from '@/components/categories/CategoryWrapper'

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    return (
        <CategoryWrapper id={id} />
    )
}
