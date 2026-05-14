import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart } from "../../cart/hook/useCart";

const DEFAULT_CURRENCY = "INR";
const IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80";

const formatMoney = (amount, currency) => {
  const safeAmount = Number(amount) || 0;
  const formatter = new Intl.NumberFormat("en-IN");
  return `${formatter.format(safeAmount)} ${currency || DEFAULT_CURRENCY}`;
};

const Cart = () => {
  const { handleGetCart, handleRemoveFromCart, handleUpdateQuantity } =
    useCart();
  const cartItems = useSelector((state) =>
    Array.isArray(state?.cart?.items) ? state.cart.items : [],
  );

  useEffect(() => {
    handleGetCart();
  }, [handleGetCart]);

  const normalizedItems = useMemo(() => {
    return cartItems.map((item, index) => {
      const product = item?.product || {};
      const variant = item?.variant || {};
      const quantity = Number(item?.quantity) > 0 ? Number(item.quantity) : 1;

      // Get the stored price (price when item was added to cart)
      const storedAmount = Number(item?.price?.amount ?? 0);

      // Get the current price (could be from variant or product)
      const currentAmount = Number(
        variant?.price?.amount ?? product?.price?.amount ?? 0,
      );

      // Use current price for display
      const amount = currentAmount || storedAmount;

      const currency =
        item?.price?.currency ||
        variant?.price?.currency ||
        product?.price?.currency ||
        DEFAULT_CURRENCY;

      // Calculate price difference
      const priceDifference = currentAmount - storedAmount;
      const savings = Math.abs(priceDifference);

      const attributeValues = Array.isArray(variant?.attributes?.values)
        ? variant.attributes.values.filter(Boolean)
        : [];

      return {
        id: item?._id || `${product?._id || "cart"}-${index}`,
        productId: product?._id,
        variantId: variant?._id,
        title: product?.title || "Untitled Product",
        image:
          variant?.images?.[0]?.url ||
          product?.images?.[0]?.url ||
          IMAGE_FALLBACK,
        color: variant?.color || "N/A",
        size: item?.selectedAttribute || "N/A",
        selectedAttribute: item?.selectedAttribute,
        quantity,
        amount,
        currency,
        storedAmount,
        currentAmount,
        priceDifference,
        savings,
        priceChanged: priceDifference !== 0,
      };
    });
  }, [cartItems]);

  const subtotal = useMemo(
    () =>
      normalizedItems.reduce(
        (runningTotal, item) => runningTotal + item.amount * item.quantity,
        0,
      ),
    [normalizedItems],
  );

  const currency = normalizedItems[0]?.currency || DEFAULT_CURRENCY;
  const isEmpty = normalizedItems.length === 0;

  const onUpdateQuantity = (
    productId,
    variantId,
    selectedAttribute,
    newQuantity,
  ) => {
    if (newQuantity < 1) {
      handleRemoveFromCart({ productId, variantId, selectedAttribute });
    } else {
      handleUpdateQuantity({
        productId,
        variantId,
        selectedAttribute,
        quantity: newQuantity,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      <main className="max-w-7xl mx-auto px-edge py-24">
        <header className="mb-20 fade-up">
          <p className="label-sm text-secondary mb-4">Your Selection</p>
          <h1 className="display-font text-7xl tracking-tight">Shopping Bag</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-8 space-y-12">
            {isEmpty ? (
              <div className="surface-card p-10 text-center">
                <p className="display-font text-3xl tracking-tight uppercase">
                  Your bag is empty
                </p>
                <p className="label-sm text-secondary lowercase italic mt-4">
                  Add something you like and it will appear here.
                </p>
                <Link
                  to="/"
                  className="btn-primary inline-flex mt-8 px-8 py-3 text-sm"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              normalizedItems.map((item, i) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row gap-10 pb-12 border-b border-gray-50 fade-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-full md:w-48 aspect-[3/4] rounded-default overflow-hidden border border-gray-100 bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="display-font text-3xl tracking-tight uppercase max-w-[70%]">
                          {item.title}
                        </h3>
                        <p className="display-font text-2xl font-medium">
                          {formatMoney(item.amount, item.currency)}
                        </p>
                      </div>
                      {item.priceChanged && (
                        <div className="mb-4">
                          {item.priceDifference < 0 ? (
                            <p className="label-sm text-green-700 lowercase italic font-medium">
                              you saved{" "}
                              {formatMoney(item.savings, item.currency)} you
                              will get it at{" "}
                              {formatMoney(item.currentAmount, item.currency)}
                            </p>
                          ) : (
                            <p className="label-sm text-red-600 lowercase italic font-medium">
                              you will need too pay{" "}
                              {formatMoney(item.savings, item.currency)} more
                              now its{" "}
                              {formatMoney(item.currentAmount, item.currency)}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="flex gap-8 flex-wrap mb-8">
                        <div className="space-y-1">
                          <p className="label-xs text-gray-400 uppercase tracking-widest">
                            Color
                          </p>
                          <p className="label-sm text-black lowercase italic">
                            {item.color}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="label-xs text-gray-400 uppercase tracking-widest">
                            Size
                          </p>
                          <p className="label-sm text-black lowercase italic">
                            {item.size}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6">
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.productId,
                              item.variantId,
                              item.selectedAttribute,
                              item.quantity - 1,
                            )
                          }
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-12 text-center label-sm mb-0">
                          {String(item.quantity).padStart(2, "0")}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.productId,
                              item.variantId,
                              item.selectedAttribute,
                              item.quantity + 1,
                            )
                          }
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          handleRemoveFromCart({
                            productId: item.productId,
                            variantId: item.variantId,
                            selectedAttribute: item.selectedAttribute,
                          })
                        }
                        className="label-sm mb-0 text-red-500 hover:text-red-700 transition-colors lowercase italic underline underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <aside
            className="lg:col-span-4 fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="surface-card p-12 sticky top-32">
              <h3 className="label-sm mb-10 text-black uppercase tracking-widest">
                Summary
              </h3>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between">
                  <p className="label-sm text-secondary lowercase italic mb-0">
                    Subtotal
                  </p>
                  <p className="font-bold">{formatMoney(subtotal, currency)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="label-sm text-secondary lowercase italic mb-0">
                    Shipping
                  </p>
                  <p className="label-sm text-black mb-0">Complimentary</p>
                </div>
              </div>
              <div className="h-[1px] bg-gray-100 mb-10"></div>
              <div className="flex justify-between mb-12">
                <p className="label-sm text-black font-bold uppercase mb-0">
                  Total
                </p>
                <p className="display-font text-4xl">
                  {formatMoney(subtotal, currency)}
                </p>
              </div>
              <button
                className="btn-primary w-full py-6 text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isEmpty}
              >
                Proceed to Checkout
              </button>
              <p className="label-sm text-gray-300 text-center mt-8 text-[9px] lowercase italic">
                Tax included. Secure payment guaranteed.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Cart;
