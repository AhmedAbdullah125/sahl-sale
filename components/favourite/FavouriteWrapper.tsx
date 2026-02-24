"use client";
import UpperHeader from "@/components/General/UpperHeader";
import ProductCard from "../General/ProductCard";
import { useGetFavouriteProducts } from "@/src/hooks/useGetFavouriteProducts";

type ProductCardProduct = React.ComponentProps<typeof ProductCard>["product"];

export default function FavouriteWrapper() {
    const { data, isLoading: loading, error: queryError } = useGetFavouriteProducts();
    const error = queryError ? (queryError as Error).message || "حدث خطأ أثناء تحميل البيانات" : null;

    const favouriteItems = data?.items || [];

    const mappedProducts: ProductCardProduct[] = favouriteItems.map((item) => ({
        id: item.id.toString(),
        href: `/product/${item.id}`,
        img: item.image,
        name: item.title,
        typeA: item.parent_category,
        typeB: item.category,
        price: item.price,
        pinned: item.is_pinned,
        isFav: item.is_favorite,
        kind: item.type === "auction" ? "auction" : undefined,
    }));

    return (
        <section className="content-section">
            <div className="container">
                <UpperHeader title="المفضلة" />

                {loading && (
                    <div className="flex justify-center items-center py-10">
                        <span className="text-gray-500">جاري التحميل...</span>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center items-center py-10">
                        <span className="text-red-500">{error}</span>
                    </div>
                )}

                {!loading && !error && favouriteItems.length === 0 && (
                    <div className="flex justify-center items-center py-10">
                        <span className="text-gray-500">لا توجد فئات</span>
                    </div>
                )}

                {!loading && !error && mappedProducts.length > 0 && (
                    <div className="category-grid">
                        {mappedProducts.map((item) => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
