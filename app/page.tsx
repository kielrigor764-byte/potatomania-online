"use client";

import { useEffect, useState } from "react";
import { toBlob } from "html-to-image";

type Screen =
  | "welcome"
  | "fulfillment"
  | "categories"
  | "items"
  | "cart"
  | "checkout"
  | "payment"
  | "receipt"
  | "success";

type Fulfillment = "Meetup" | "Delivery" | null;

type Category = {
  id: string;
  name: string;
  description: string;
};

type AddOn = {
  id: string;
  name: string;
  price: number;
};

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
};

type CartItem = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  price: number;
  quantity: number;
  toppings: AddOn[];
};

type CustomerInfo = {
  name: string;
  contact: string;
  notes: string;
};

const categories: Category[] = [
  {
    id: "spuds",
    name: "Spuds",
    description:
      "Build your own or choose from our delicious potato creations.",
  },
  {
    id: "tornado",
    name: "Tornado Potato",
    description:
      "Crispy spiral potatoes with your choice of flavor.",
  },
  {
    id: "iced-tea",
    name: "Iced Tea",
    description:
      "A refreshing drink to pair with your favorite snack.",
  },
  {
    id: "combo",
    name: "Combo Meals",
    description:
      "Delicious Potatomania favorites paired with iced tea.",
  },
];

const products: Product[] = [
  {
    id: "spud-supreme",
    name: "Spud Supreme",
    category: "spuds",
    description:
      "Select how you like your Spuds.",
    price: 105,
    image: "/spuds/supreme-spud.png",
  },
  {
    id: "cheesy-bacon",
    name: "Cheesy Bacon",
    category: "spuds",
    description:
      "Bacon bits, spring onion, shredded cheese, and cheese sauce.",
    price: 140,
    image: "/spuds/cheesy-bacon.png",
  },
  {
    id: "creamy-mushroom",
    name: "Creamy Mushroom",
    category: "spuds",
    description:
      "Mushroom, white onion, shredded cheese, and garlic mayo.",
    price: 130,
    image: "/spuds/creamy-mushroom.png",
  },
  {
    id: "cheesy-corn",
    name: "Cheesy Corn",
    category: "spuds",
    description:
      "Corn, shredded cheese, cheese sauce, and spring onion.",
    price: 120,
    image: "/spuds/cheesy-corn.png",
  },
  {
    id: "ham-cheese",
    name: "Ham & Cheese",
    category: "spuds",
    description:
      "Ham, shredded cheese, cheese sauce, and spring onion.",
    price: 120,
    image: "/spuds/ham-cheese.png",
  },
  {
    id: "chicken-cheese",
    name: "Chicken Cheese",
    category: "spuds",
    description:
      "Chicken bites, shredded cheese, cheese sauce, and spring onion.",
    price: 120,
    image: "/spuds/chicken-cheese.png",
  },
  {
    id: "ham-corn",
    name: "Ham & Corn",
    category: "spuds",
    description:
      "Ham, corn, shredded cheese, and garlic mayo.",
    price: 130,
    image: "/spuds/ham-corn.png",
  },
  {
    id: "mushroom-melt",
    name: "Mushroom Melt",
    category: "spuds",
    description:
      "Mushroom, white onion, shredded cheese, and cheese sauce.",
    price: 140,
    image: "/spuds/mushroom-melt.png",
  },
  {
    id: "bacon-garlic",
    name: "Bacon Garlic",
    category: "spuds",
    description:
      "Bacon bits, white onion, lettuce, and garlic mayo.",
    price: 140,
    image: "/spuds/bacon-garlic.png",
  },
  {
    id: "tornado-cheese",
    name: "Cheese Tornado Potato",
    category: "tornado",
    description:
      "A crispy tornado potato with Cheese flavor.",
    price: 60,
    image: "/tornado%20potato/cheese-tornado-potato.png",
  },
  {
    id: "tornado-bbq",
    name: "BBQ Tornado Potato",
    category: "tornado",
    description:
      "A crispy tornado potato with BBQ flavor.",
    price: 60,
    image: "/tornado%20potato/bbq-tornado-potato.png",
  },
  {
    id: "tornado-sourcream",
    name: "Sourcream Tornado Potato",
    category: "tornado",
    description:
      "A crispy tornado potato with sourcream flavor.",
    price: 60,
    image: "/tornado%20potato/sourcream-tornado-potato.png",
  },
  {
    id: "iced-tea",
    name: "Iced Tea",
    category: "iced-tea",
    description:
      "A refreshing regular-sized iced tea.",
    price: 25,
    image: "/iced%20tea/iced-tea.png",
  },
  {
    id: "combo-1",
    name: "Combo 1 — Spud & Sip",
    category: "combo",
    description:
      "Original Spud paired with iced tea.",
    price: 165,
    image: "/combo%20meals/combo-one.png",
  },
  {
    id: "combo-2",
    name: "Combo 2 — Tornado Twist",
    category: "combo",
    description:
      "A crispy tornado potato with your choice of flavor paired with iced tea.",
    price: 105,
    image: "/combo%20meals/combo-two.png",
  },
];

const toppings: AddOn[] = [
  { id: "shredded-cheese", name: "Shredded Cheese", price: 10 },
  { id: "bacon-bits", name: "Bacon Bits", price: 12 },
  { id: "chicken-bites", name: "Chicken Bites", price: 12 },
  { id: "corn", name: "Corn", price: 5 },
  { id: "ham", name: "Ham", price: 12 },
  { id: "spring-onions", name: "Spring Onions", price: 5 },
  { id: "mushroom", name: "Mushroom", price: 5 },
  { id: "carrots", name: "Carrots", price: 5 },
  { id: "white-onion", name: "White Onion", price: 5 },
  { id: "cheese-sauce", name: "Cheese Sauce", price: 5 },
  { id: "garlic-mayo", name: "Garlic Mayo", price: 12 },
];

function createOrderId() {
  return `PM-${Date.now()}`;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");

  const [fulfillment, setFulfillment] =
    useState<Fulfillment>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [selectedToppings, setSelectedToppings] =
    useState<AddOn[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [customerInfo, setCustomerInfo] =
    useState<CustomerInfo>({
      name: "",
      contact: "",
      notes: "",
    });

  const [orderId, setOrderId] = useState("");

  const [orderDate, setOrderDate] = useState("");

  const [gcashPaid, setGcashPaid] = useState(false);

  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);

  const [gcashReference, setGcashReference] = useState("");

  const [isSavingOrder, setIsSavingOrder] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [screen]);

  const cartQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const selectedProducts = products.filter(
    (product) => product.category === selectedCategory,
  );

  function chooseFulfillment(option: Fulfillment) {
    setFulfillment(option);
    setScreen("categories");
  }

  function openCategory(categoryId: string) {
    setSelectedCategory(categoryId);
    setSelectedProduct(null);
    setSelectedToppings([]);
    setScreen("items");
  }

  function openProduct(product: Product) {
    setSelectedProduct(product);
    setSelectedToppings([]);
  }

  function toggleTopping(topping: AddOn) {
    setSelectedToppings((currentToppings) =>
      currentToppings.some((item) => item.id === topping.id)
        ? currentToppings.filter((item) => item.id !== topping.id)
        : [...currentToppings, topping],
    );
  }

  function formatPrice(value: number) {
    return `₱ ${value.toFixed(2)}`;
  }

  function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function addToCart() {
    if (!selectedProduct) {
      return;
    }

    const addOnTotal = selectedToppings.reduce((total, topping) => total + topping.price, 0);

    const newCartItem: CartItem = {
      id: `${selectedProduct.id}-${cart.length}-${Date.now()}`,
      name: selectedProduct.name,
      description: selectedProduct.description,
      basePrice: selectedProduct.price,
      price: selectedProduct.price + addOnTotal,
      quantity: 1,
      toppings: [...selectedToppings],
    };

    setCart((currentCart) => [
      ...currentCart,
      newCartItem,
    ]);

    setSelectedProduct(null);
    setSelectedToppings([]);
  }

  function increaseQuantity(itemId: string) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  }

  function decreaseQuantity(itemId: string) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(itemId: string) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== itemId),
    );
  }

  function goToCart() {
    setScreen("cart");
  }

  function goToCheckout() {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setScreen("checkout");
  }

  function updateCustomerInfo(
    field: keyof CustomerInfo,
    value: string,
  ) {
    setCustomerInfo((currentInfo) => ({
      ...currentInfo,
      [field]: value,
    }));
  }

  function continueToOrderReview() {
    if (
      !customerInfo.name.trim() ||
      !customerInfo.contact.trim()
    ) {
      alert(
        "Please enter your name and contact information.",
      );
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      setScreen("cart");
      return;
    }

    setScreen("payment");
  }

  async function generateReceipt() {
    if (!gcashPaid) {
      alert("Please confirm that you have completed your GCash payment first.");
      return;
    }

    if (!gcashReference.trim()) {
      alert("Please enter your GCash payment reference number.");
      return;
    }

    if (!paymentScreenshot) {
      alert("Please upload a screenshot of your GCash payment before securing your pre-order.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      setScreen("cart");
      return;
    }

    if (!customerInfo.name.trim() || !customerInfo.contact.trim()) {
      alert("Please enter your name and contact information first.");
      setScreen("checkout");
      return;
    }

    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
      .replace(/\/+$/, "")
      .replace(/\/rest\/v1$/, "");
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      alert("Supabase is not configured. Please check your .env.local file.");
      return;
    }

    setIsSavingOrder(true);

    const newOrderId = createOrderId();
    const screenshotPath = `${newOrderId}/${Date.now()}-${paymentScreenshot.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const screenshotUploadUrl = `${supabaseUrl}/storage/v1/object/payment-screenshots/${screenshotPath}`;
    const screenshotPublicUrl = `${supabaseUrl}/storage/v1/object/public/payment-screenshots/${screenshotPath}`;

    try {
      const uploadResponse = await fetch(screenshotUploadUrl, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": paymentScreenshot.type || "application/octet-stream",
          "x-upsert": "false",
        },
        body: paymentScreenshot,
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.text();
        throw new Error(uploadError || "The payment screenshot could not be uploaded.");
      }

      const orderPayload = {
        order_number: newOrderId,
        customer_name: customerInfo.name.trim(),
        customer_contact: customerInfo.contact.trim(),
        fulfillment_type: fulfillment ?? "Not specified",
        items: cart,
        total_amount: getCartTotal(),
        gcash_reference: gcashReference.trim(),
        payment_screenshot_url: screenshotPublicUrl,
        payment_status: "Pending",
        notes: customerInfo.notes.trim(),
      };

      const orderResponse = await fetch(`${supabaseUrl}/rest/v1/orders`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderResponse.ok) {
        const orderError = await orderResponse.text();
        throw new Error(orderError || "The order could not be saved.");
      }

      setOrderId(newOrderId);
      setOrderDate(
        new Date().toLocaleString("en-PH", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      );
      setScreen("receipt");
    } catch (error) {
      console.error("PotatoMania order submission failed:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`We could not save your order.\n\nDetails: ${errorMessage}`);
    } finally {
      setIsSavingOrder(false);
    }
  }

  async function downloadReceipt() {
    const receiptElement = document.getElementById("potatomania-receipt");

    if (!receiptElement) {
      alert("Receipt could not be found. Please try again.");
      return;
    }

    let captureHost: HTMLDivElement | null = null;

    try {
      // Capture a separate, unconstrained copy of the receipt. This prevents
      // the kiosk's responsive layout or viewport from clipping the image.
      captureHost = document.createElement("div");
      captureHost.style.position = "absolute";
      captureHost.style.left = "-100000px";
      captureHost.style.top = "0";
      captureHost.style.width = "760px";
      captureHost.style.minWidth = "760px";
      captureHost.style.maxWidth = "760px";
      captureHost.style.height = "auto";
      captureHost.style.minHeight = "0";
      captureHost.style.maxHeight = "none";
      captureHost.style.overflow = "visible";
      captureHost.style.background = "#ffffff";
      captureHost.style.padding = "0";
      captureHost.style.margin = "0";
      captureHost.style.pointerEvents = "none";
      captureHost.style.zIndex = "-1";

      const receiptClone = receiptElement.cloneNode(true) as HTMLDivElement;
      receiptClone.removeAttribute("id");
      receiptClone.style.boxSizing = "border-box";
      receiptClone.style.display = "block";
      receiptClone.style.width = "760px";
      receiptClone.style.minWidth = "760px";
      receiptClone.style.maxWidth = "760px";
      receiptClone.style.height = "auto";
      receiptClone.style.minHeight = "0";
      receiptClone.style.maxHeight = "none";
      receiptClone.style.overflow = "visible";
      receiptClone.style.margin = "0";
      receiptClone.style.transform = "none";

      captureHost.appendChild(receiptClone);
      document.body.appendChild(captureHost);

      // Force layout before measuring so all wrapped text and receipt rows
      // contribute to the final image height.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      const captureWidth = Math.ceil(
        Math.max(receiptClone.getBoundingClientRect().width, receiptClone.scrollWidth, 760),
      );
      const captureHeight = Math.ceil(
        Math.max(receiptClone.getBoundingClientRect().height, receiptClone.scrollHeight),
      );

      const blob = await toBlob(receiptClone, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        width: captureWidth,
        height: captureHeight,
        style: {
          boxSizing: "border-box",
          display: "block",
          width: `${captureWidth}px`,
          minWidth: `${captureWidth}px`,
          maxWidth: `${captureWidth}px`,
          height: `${captureHeight}px`,
          minHeight: `${captureHeight}px`,
          maxHeight: "none",
          overflow: "visible",
          margin: "0",
          transform: "none",
        },
      });

      if (!blob) {
        throw new Error("Receipt image could not be created.");
      }

      const fileName = `PotatoMania-Receipt-${orderId || "order"}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "PotatoMania Receipt",
          text: "Here is my PotatoMania order receipt.",
          files: [file],
        });
        return;
      }

      const imageUrl = URL.createObjectURL(blob);
      const isMobileDevice = /Android|iPhone|iPad|iPod|Windows Phone/i.test(
        navigator.userAgent,
      );

      if (isMobileDevice) {
        // Many mobile browsers ignore the download attribute for blob URLs.
        // Opening the image lets the customer long-press it and save it.
        const imageWindow = window.open(imageUrl, "_blank");

        if (!imageWindow) {
          alert(
            "Your browser blocked the receipt image window. Please allow pop-ups for this site and try again.",
          );
        } else {
          alert(
            "Your receipt image is open in a new tab. Press and hold the image, then choose Save Image or Download Image.",
          );
        }

        window.setTimeout(() => URL.revokeObjectURL(imageUrl), 60_000);
        return;
      }

      const downloadLink = document.createElement("a");
      downloadLink.href = imageUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(imageUrl), 60_000);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error("Receipt image error:", error);
      alert("We could not create the receipt image. Please try again.");
    } finally {
      captureHost?.remove();
    }
  }

  function proceedToSuccess() {
    setCart([]);
    setScreen("success");
  }

  function resetOrder() {
    setScreen("welcome");
    setFulfillment(null);
    setSelectedCategory(null);
    setSelectedProduct(null);
    setSelectedToppings([]);
    setCart([]);
    setCustomerInfo({
      name: "",
      contact: "",
      notes: "",
    });
    setOrderId("");
    setOrderDate("");
  }

  function goBackToCategories() {
    setSelectedCategory(null);
    setSelectedProduct(null);
    setSelectedToppings([]);
    setScreen("categories");
  }

  return (
    <main className="min-h-screen bg-[#f8fbff] pb-32 text-[#12304f]">
      <header className="border-b-4 border-[#0756a8] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <button
            type="button"
            onClick={() => setScreen("welcome")}
            className="flex items-center gap-3 text-left"
          >
            <img
              src="/potman-logo.png"
              alt="Potatomania logo"
              className="h-14 w-14 object-contain"
            />

            <div>
              <p className="text-xl font-black leading-none text-[#0756a8]">
                Potatomania
              </p>

              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#f28c28]">
                Baked, Loaded & Loved.
              </p>
            </div>
          </button>

          {screen !== "welcome" &&
            screen !== "fulfillment" &&
            screen !== "success" && (
              <div className="rounded-full bg-[#fff4b8] px-4 py-2 text-sm font-black text-[#0756a8]">
                {screen === "categories" && "Step 1 of 5"}
                {screen === "items" && "Step 2 of 5"}
                {screen === "cart" && "Step 3 of 5"}
                {screen === "checkout" && "Step 4 of 5"}
                {screen === "payment" && "Step 5 of 5"}
              </div>
            )}
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-8">
        {screen === "welcome" && (
          <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <div className="rounded-[2.5rem] border-4 border-[#0756a8] bg-white px-7 py-10 shadow-[10px_10px_0_#f28c28]">
              <img
                src="/potman-logo.png"
                alt="PotatoMania"
                className="mx-auto mb-6 h-44 w-44 object-contain"
              />

              <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-[#f28c28]">
                Welcome to
              </p>

              <img
                src="/potatomania-welcome-logo.png"
                alt="Potatomania logo"
                className="mx-auto w-full max-w-[28rem] object-contain"
              />

              <p className="mx-auto mt-5 max-w-md text-base font-semibold leading-relaxed text-[#45627d]">
                Baked, Loaded & Loved. Your Go-To Potato Cravings.
              </p>

              <button
                type="button"
                onClick={() => setScreen("fulfillment")}
                className="mt-8 rounded-full border-4 border-[#0756a8] bg-[#0756a8] px-8 py-4 text-lg font-black text-white transition hover:-translate-y-1 hover:bg-[#064783]"
              >
                Start Your Order
              </button>
            </div>
          </div>
        )}

        {screen === "fulfillment" && (
          <div className="mx-auto max-w-2xl">
            <button
              type="button"
              onClick={() => setScreen("welcome")}
              className="mb-6 font-black text-[#0756a8] hover:underline"
            >
              ← Back
            </button>

            <div className="rounded-[2rem] border-4 border-[#0756a8] bg-white p-6 shadow-[8px_8px_0_#f28c28] sm:p-8">
              <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                Let’s get started
              </p>

              <h1 className="mt-2 text-4xl font-black text-[#0756a8]">
                How would you like to receive your order?
              </h1>

              <p className="mt-3 text-[#45627d]">
                Choose your preferred fulfillment method before
                browsing the menu.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => chooseFulfillment("Meetup")}
                  className="rounded-3xl border-4 border-[#0756a8] bg-[#e9f4ff] p-6 text-left transition hover:-translate-y-1 hover:bg-[#d8ebff]"
                >
                  <span className="text-sm font-black uppercase tracking-widest text-[#0756a8]">In-person pickup</span>

                  <h2 className="mt-4 text-2xl font-black text-[#0756a8]">
                    Meet-up
                  </h2>

                  <p className="mt-2 font-semibold text-[#45627d]">
                    Meet-up availability and location will be
                    announced on our social media.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => chooseFulfillment("Delivery")}
                  className="rounded-3xl border-4 border-[#0756a8] bg-[#fff4b8] p-6 text-left transition hover:-translate-y-1 hover:bg-[#ffe98a]"
                >
                  <span className="text-sm font-black uppercase tracking-widest text-[#0756a8]">Rider delivery</span>

                  <h2 className="mt-4 text-2xl font-black text-[#0756a8]">
                    Delivery
                  </h2>

                  <p className="mt-2 font-semibold text-[#45627d]">
                    The customer books a rider separately for
                    pickup and delivery.
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === "categories" && (
          <div>
            <div className="mb-8">
              <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                Step 1
              </p>

              <h1 className="mt-2 text-4xl font-black text-[#0756a8] sm:text-5xl">
                Choose your potato cravings!
              </h1>

              <p className="mt-3 max-w-2xl font-semibold text-[#45627d]">
                Pick a category to explore the Potatomania menu.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {categories.map((category) => (
                <button
                  key={`category-${category.id}`}
                  type="button"
                  onClick={() => openCategory(category.id)}
                  className="rounded-[2rem] border-4 border-[#0756a8] bg-white p-6 text-left shadow-[6px_6px_0_#d8eaff] transition hover:-translate-y-1 hover:bg-[#f0f7ff]"
                >

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                        Potatomania
                      </p>

                      <h2 className="mt-2 text-3xl font-black text-[#0756a8]">
                        {category.name}
                      </h2>

                      <p className="mt-3 font-semibold leading-relaxed text-[#45627d]">
                        {category.description}
                      </p>
                    </div>

                    <span className="text-4xl">
                      <span className="text-sm font-black uppercase tracking-widest text-[#0756a8]">View menu</span>
                    </span>
                  </div>

                  <div className="mt-6 font-black text-[#0756a8]">
                    Explore category →
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === "items" && (
          <div>
            <button
              type="button"
              onClick={goBackToCategories}
              className="mb-6 font-black text-[#0756a8] hover:underline"
            >
              ← Back to Categories
            </button>

            <div className="mb-8">
              <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                Step 2
              </p>

              <h1 className="mt-2 text-4xl font-black text-[#0756a8] sm:text-5xl">
                {categories.find(
                  (category) => category.id === selectedCategory,
                )?.name ?? "Menu"}
              </h1>

              <p className="mt-3 font-semibold text-[#45627d]">
                Select an item to view its details and customize
                your order.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {selectedProducts.map((product) => (
                <button
                  key={`product-${product.id}`}
                  type="button"
                  onClick={() => openProduct(product)}
                  className={`rounded-[2rem] border-4 p-6 text-left transition hover:-translate-y-1 ${
                    product.id === "tornado-cheese"
                      ? "border-[#e3a51d] bg-[#fff0a6] shadow-[6px_6px_0_#e3a51d] hover:bg-[#ffe58a]"
                      : product.id === "tornado-sourcream"
                        ? "border-[#7fa83d] bg-[#dff0a5] shadow-[6px_6px_0_#7fa83d] hover:bg-[#cfe68a]"
                        : product.id === "tornado-bbq"
                          ? "border-[#b95735] bg-[#e98458] shadow-[6px_6px_0_#b95735] hover:bg-[#df7049]"
                          : "border-[#0756a8] bg-white shadow-[6px_6px_0_#fff0a6] hover:bg-[#fffdf1]"
                  }` }
                >
                  {product.image && (
                    <div className="mb-5 flex min-h-36 items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={
                          product.category === "spuds"
                            ? "h-36 w-36 rounded-full border-4 border-[#f28c28] object-cover shadow-md"
                            : "max-h-40 w-full max-w-[18rem] object-contain"
                        }
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {product.category === "spuds" &&
                        product.name !== "Spud Supreme" && (
                          <p className="mb-2 text-sm font-black uppercase tracking-widest text-[#f28c28]">
                            Signature Flavors
                          </p>
                        )}

                      <h2 className="mt-6 text-2xl font-black text-[#0756a8]">
                        {product.name}
                      </h2>

                      <p className="mt-3 font-semibold leading-relaxed text-[#45627d]">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="font-black text-[#f28c28]">
                      {formatPrice(product.price)}
                    </span>

                    {product.name === "Spud Supreme" && (
                      <span className="font-black text-[#0756a8]">
                        Customize →
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {selectedProduct && (
              <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#12304f]/60 p-4 sm:items-center">
                <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border-4 border-[#0756a8] bg-white p-6 shadow-[8px_8px_0_#f28c28] sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                        Customize your order
                      </p>

                      <h2 className="mt-2 text-3xl font-black text-[#0756a8]">
                        {selectedProduct.name}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct(null);
                        setSelectedToppings([]);
                      }}
                      className="rounded-full bg-[#e9f4ff] px-4 py-2 font-black text-[#0756a8] hover:bg-[#d8ebff]"
                    >
                      Close
                    </button>
                  </div>

                  <p className="mt-4 font-semibold leading-relaxed text-[#45627d]">
                    {selectedProduct.description}
                  </p>

                  {selectedCategory === "spuds" &&
                    selectedProduct.id === "spud-supreme" && (
                      <div className="mt-7">
                        <h3 className="text-xl font-black text-[#0756a8]">
                          Choose your toppings
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-[#45627d]">
                          Select the toppings you want with your
                          Spud Supreme.
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {toppings.map((topping) => {
                            const isSelected =
                              selectedToppings.some((item) => item.id === topping.id);

                            return (
                              <button
                                key={`topping-${topping.id}`}
                                type="button"
                                onClick={() =>
                                  toggleTopping(topping)
                                }
                                className={`rounded-2xl border-2 px-4 py-3 text-left font-bold transition ${
                                  isSelected
                                    ? "border-[#0756a8] bg-[#0756a8] text-white"
                                    : "border-[#c8dff5] bg-[#f8fbff] text-[#0756a8] hover:bg-[#e9f4ff]"
                                }`}
                              >
                                {isSelected ? "✓ " : ""}
                                {topping.name}
                                <span className="ml-2 text-sm font-black">+{formatPrice(topping.price)}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={addToCart}
                      className="flex-1 rounded-full border-4 border-[#0756a8] bg-[#0756a8] px-6 py-3 font-black text-white transition hover:bg-[#064783]"
                    >
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct(null);
                        setSelectedToppings([]);
                      }}
                      className="rounded-full border-4 border-[#0756a8] px-6 py-3 font-black text-[#0756a8] transition hover:bg-[#e9f4ff]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {screen === "cart" && (
          <div>
            <div className="mb-8">
              <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                Step 3
              </p>

              <h1 className="mt-2 text-4xl font-black text-[#0756a8] sm:text-5xl">
                Your Cart
              </h1>

              <p className="mt-3 font-semibold text-[#45627d]">
                Review your selected items before continuing.
              </p>
            </div>

            {cart.length === 0 ? (
              <div className="rounded-[2rem] border-4 border-[#0756a8] bg-white p-8 text-center shadow-[6px_6px_0_#fff0a6]">
                <div className="text-sm font-black uppercase tracking-widest text-[#f28c28]">No items yet</div>

                <h2 className="mt-4 text-3xl font-black text-[#0756a8]">
                  Your cart is empty
                </h2>

                <p className="mt-3 font-semibold text-[#45627d]">
                  Add something delicious from the menu to get
                  started.
                </p>

                <button
                  type="button"
                  onClick={goBackToCategories}
                  className="mt-6 rounded-full border-4 border-[#0756a8] bg-[#0756a8] px-7 py-3 font-black text-white hover:bg-[#064783]"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {cart.map((item) => (
                  <div
                    key={`cart-item-${item.id}`}
                    className="rounded-[2rem] border-4 border-[#0756a8] bg-white p-5 shadow-[5px_5px_0_#d8eaff]"
                  >
                    <div className="flex flex-col justify-between gap-5 sm:flex-row">
                      <div>
                        <h2 className="text-2xl font-black text-[#0756a8]">
                          {item.name}
                        </h2>

                        <p className="mt-2 font-semibold text-[#45627d]">
                          {item.description}
                        </p>

                        {item.toppings.length > 0 && (
                          <p className="mt-3 text-sm font-bold text-[#f28c28]">
                            Toppings:{" "}
                            {item.toppings.map((topping) => `${topping.name} (+${formatPrice(topping.price)})`).join(", ")}
                          </p>
                        )}

                        <p className="mt-3 text-sm font-semibold text-[#45627d]">
                          Base price: {formatPrice(item.basePrice)}
                        </p>

                        <p className="mt-1 font-black text-[#0756a8]">
                          Unit total: {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <div className="flex items-center gap-3 rounded-full bg-[#e9f4ff] p-2">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-black text-[#0756a8] hover:bg-[#fff4b8]"
                          >
                            −
                          </button>

                          <span className="min-w-5 text-center font-black text-[#0756a8]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-black text-[#0756a8] hover:bg-[#fff4b8]"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          className="font-black text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="rounded-[2rem] border-4 border-[#0756a8] bg-[#fff4b8] p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-lg font-black text-[#0756a8]">
                      Total Items
                    </span>

                    <span className="text-2xl font-black text-[#0756a8]">
                      {cartQuantity}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4 border-t-2 border-[#f28c28] pt-4">
                    <span className="text-lg font-black text-[#0756a8]">Order Total</span>
                    <span className="text-2xl font-black text-[#0756a8]">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={goBackToCategories}
                  className="w-full rounded-full border-4 border-[#0756a8] bg-white px-6 py-4 font-black text-[#0756a8] transition hover:bg-[#e9f4ff]"
                >
                  ← Continue Shopping
                </button>

                <button
                  type="button"
                  onClick={goToCheckout}
                  className="w-full rounded-full border-4 border-[#0756a8] bg-[#0756a8] px-6 py-4 font-black text-white transition hover:bg-[#064783]"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        )}

        {screen === "checkout" && (
          <div>
            <button
              type="button"
              onClick={() => setScreen("cart")}
              className="mb-6 font-black text-[#0756a8] hover:underline"
            >
              ← Back to Cart
            </button>

            <div className="mb-8">
              <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                Step 4
              </p>

              <h1 className="mt-2 text-4xl font-black text-[#0756a8] sm:text-5xl">
                Customer Details
              </h1>

              <p className="mt-3 font-semibold text-[#45627d]">
                Enter your details so we can prepare your
                pre-order.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[2rem] border-4 border-[#0756a8] bg-white p-6 shadow-[6px_6px_0_#d8eaff]">
                <h2 className="text-2xl font-black text-[#0756a8]">
                  Your Information
                </h2>

                <div className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="customer-name"
                      className="mb-2 block font-black text-[#0756a8]"
                    >
                      Full Name
                    </label>

                    <input
                      id="customer-name"
                      type="text"
                      value={customerInfo.name}
                      onChange={(event) =>
                        updateCustomerInfo(
                          "name",
                          event.target.value,
                        )
                      }
                      placeholder="Enter your full name"
                      className="w-full rounded-2xl border-2 border-[#c8dff5] bg-[#f8fbff] px-4 py-3 font-semibold outline-none focus:border-[#0756a8]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="customer-contact"
                      className="mb-2 block font-black text-[#0756a8]"
                    >
                      Contact Information
                    </label>

                    <input
                      id="customer-contact"
                      type="text"
                      value={customerInfo.contact}
                      onChange={(event) =>
                        updateCustomerInfo(
                          "contact",
                          event.target.value,
                        )
                      }
                      placeholder="Phone number or preferred contact"
                      className="w-full rounded-2xl border-2 border-[#c8dff5] bg-[#f8fbff] px-4 py-3 font-semibold outline-none focus:border-[#0756a8]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="customer-notes"
                      className="mb-2 block font-black text-[#0756a8]"
                    >
                      Notes
                    </label>

                    <textarea
                      id="customer-notes"
                      value={customerInfo.notes}
                      onChange={(event) =>
                        updateCustomerInfo(
                          "notes",
                          event.target.value,
                        )
                      }
                      placeholder="Additional instructions or order notes"
                      rows={5}
                      className="w-full resize-none rounded-2xl border-2 border-[#c8dff5] bg-[#f8fbff] px-4 py-3 font-semibold outline-none focus:border-[#0756a8]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={continueToOrderReview}
                  className="mt-6 w-full rounded-full border-4 border-[#0756a8] bg-[#0756a8] px-6 py-4 font-black text-white transition hover:bg-[#064783]"
                >
                  Continue to Order Review
                </button>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border-4 border-[#0756a8] bg-[#fff4b8] p-6">
                  <h2 className="text-2xl font-black text-[#0756a8]">
                    Fulfillment
                  </h2>

                  <p className="mt-3 font-bold text-[#45627d]">
                    {fulfillment === "Meetup"
                      ? "Meet-up"
                      : "Delivery"}
                  </p>

                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[#45627d]">
                    {fulfillment === "Meetup"
                      ? "Meet-up availability and location will be announced on PotatoMania social media."
                      : "You will need to book a rider separately for pickup and delivery."}
                  </p>
                </div>

                <div className="rounded-[2rem] border-4 border-[#0756a8] bg-white p-6 shadow-[6px_6px_0_#fff0a6]">
                  <h2 className="text-2xl font-black text-[#0756a8]">
                    Order Summary
                  </h2>

                  <div className="mt-5 space-y-4">
                    {cart.map((item) => (
                      <div
                        key={`checkout-item-${item.id}`}
                        className="border-b-2 border-[#e9f4ff] pb-4"
                      >
                        <div className="flex justify-between gap-4">
                          <p className="font-black text-[#0756a8]">
                            {item.name}
                          </p>

                          <p className="font-black text-[#0756a8]">
                            ×{item.quantity}
                          </p>
                        </div>

                        {item.toppings.length > 0 && (
                          <p className="mt-1 text-sm font-semibold text-[#45627d]">
                            {item.toppings.map((topping) => `${topping.name} (+${formatPrice(topping.price)})`).join(", ")}
                          </p>
                        )}

                        <p className="mt-1 text-sm font-bold text-[#f28c28]">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex justify-between gap-4">
                    <span className="font-black text-[#0756a8]">
                      Total Items
                    </span>

                    <span className="text-xl font-black text-[#0756a8]">
                      {cartQuantity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === "payment" && (
          <div>
            <button
              type="button"
              onClick={() => setScreen("checkout")}
              className="mb-6 font-black text-[#0756a8] hover:underline"
            >
              ← Back to Customer Details
            </button>

            <div className="mb-8">
              <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                Step 5
              </p>

              <h1 className="mt-2 text-4xl font-black text-[#0756a8] sm:text-5xl">
                Order Review
              </h1>

              <p className="mt-3 max-w-2xl font-semibold text-[#45627d]">
                Review your order details, fill in your customer information, pay the confirmed amount through GCash, confirm payment, then generate and save your receipt image.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-[2rem] border-4 border-[#0756a8] bg-white p-6 shadow-[6px_6px_0_#d8eaff]">
                  <h2 className="text-2xl font-black text-[#0756a8]">Customer Information</h2>
                  <div className="mt-5 space-y-3">
                    <div>
                      <p className="text-sm font-black uppercase tracking-wide text-[#f28c28]">Full Name</p>
                      <p className="mt-1 font-bold text-[#45627d]">{customerInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-wide text-[#f28c28]">Contact</p>
                      <p className="mt-1 font-bold text-[#45627d]">{customerInfo.contact}</p>
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-wide text-[#f28c28]">Notes</p>
                      <p className="mt-1 whitespace-pre-wrap font-bold text-[#45627d]">
                        {customerInfo.notes.trim() ? customerInfo.notes : "No additional notes"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border-4 border-[#0756a8] bg-[#fff4b8] p-6">
                  <h2 className="text-2xl font-black text-[#0756a8]">Fulfillment Method</h2>
                  <p className="mt-3 font-black text-[#45627d]">
                    {fulfillment === "Meetup" ? "Meet-up" : "Delivery"}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[#45627d]">
                    {fulfillment === "Meetup"
                      ? "Meet-up availability and location will be announced on PotatoMania social media."
                      : "You will need to book a rider separately for pickup and delivery."}
                  </p>
                </div>

                <div className="rounded-[2rem] border-4 border-[#0756a8] bg-white p-6 shadow-[6px_6px_0_#fff0a6]">
                  <h2 className="text-2xl font-black text-[#0756a8]">Your Order</h2>
                  <div className="mt-5 space-y-4">
                    {cart.map((item) => (
                      <div key={`payment-item-${item.id}`} className="border-b-2 border-[#e9f4ff] pb-4">
                        <div className="flex justify-between gap-4">
                          <p className="font-black text-[#0756a8]">{item.name}</p>
                          <p className="font-black text-[#0756a8]">×{item.quantity}</p>
                        </div>
                        {item.toppings.length > 0 && (
                          <p className="mt-1 text-sm font-semibold text-[#45627d]">
                            Toppings: {item.toppings.map((topping) => `${topping.name} (+${formatPrice(topping.price)})`).join(", ")}
                          </p>
                        )}
                        <p className="mt-1 font-bold text-[#f28c28]">{formatPrice(item.price)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className="font-black text-[#0756a8]">Total Items</span>
                    <span className="text-2xl font-black text-[#0756a8]">{cartQuantity}</span>
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-relaxed text-[#45627d]">
                    Please pay the exact Order Total shown above through GCash before confirming your payment.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border-4 border-[#0756a8] bg-[#fff4b8] p-6 shadow-[6px_6px_0_#d8eaff]">
                  <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">Required Before Receipt</p>
                  <h2 className="mt-2 text-3xl font-black text-[#0756a8]">Pay via GCash First</h2>
                  <p className="mt-4 font-semibold leading-relaxed text-[#45627d]">
                    After filling in your customer information, pay the confirmed total using the GCash QR code and GCash number shown below. Once payment is complete, confirm it to generate your receipt.
                  </p>
                  <div className="mt-5 rounded-2xl border-2 border-[#0756a8] bg-white p-4 text-center">
                    <p className="font-black text-[#0756a8]">GCash Payment Details</p>
                    <p className="mt-2 font-black text-[#0756a8]">Scan the QR code to pay</p>
                    <div className="mt-4 flex justify-center">
                      <img
                        src="/gcash-qr.jpeg"
                        alt="PotatoMania GCash QR code"
                        className="h-auto w-full max-w-[320px] rounded-xl object-contain"
                      />
                    </div>
                    <p className="mt-4 text-sm font-bold text-[#45627d]">GCash Number</p>
                    <p className="mt-1 text-2xl font-black tracking-wide text-[#0756a8]">09568075788</p>
                  </div>
                  <div className="mt-5 rounded-2xl border-2 border-[#0756a8] bg-white p-4">
                    <label className="block font-black text-[#0756a8]" htmlFor="gcash-reference">
                      GCash Payment Reference Number
                    </label>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-[#45627d]">
                      Enter the reference number shown on your successful GCash transaction.
                    </p>
                    <input
                      id="gcash-reference"
                      type="text"
                      value={gcashReference}
                      onChange={(event) => setGcashReference(event.target.value)}
                      placeholder="Enter GCash reference number"
                      className="mt-3 block w-full rounded-xl border-2 border-[#d8eaff] bg-white p-3 text-sm font-bold text-[#45627d] outline-none focus:border-[#0756a8]"
                    />
                  </div>
                  <div className="mt-5 rounded-2xl border-2 border-[#0756a8] bg-white p-4">
                    <label className="block font-black text-[#0756a8]" htmlFor="payment-screenshot">
                      Upload GCash Payment Screenshot
                    </label>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-[#45627d]">
                      Upload a clear screenshot of your successful GCash payment. This is required before your pre-order can be secured.
                    </p>
                    <input
                      id="payment-screenshot"
                      type="file"
                      accept="image/*"
                      onChange={(event) => setPaymentScreenshot(event.target.files?.[0] ?? null)}
                      className="mt-3 block w-full rounded-xl border-2 border-[#d8eaff] bg-white p-3 text-sm font-bold text-[#45627d]"
                    />
                    {paymentScreenshot && (
                      <p className="mt-2 text-sm font-black text-[#0756a8]">
                        Selected: {paymentScreenshot.name}
                      </p>
                    )}
                  </div>
                  <label className="mt-4 flex items-start gap-3 font-bold text-[#45627d]">
                    <input
                      type="checkbox"
                      checked={gcashPaid}
                      onChange={(event) => setGcashPaid(event.target.checked)}
                      className="mt-1 h-5 w-5 accent-[#0756a8]"
                    />
                    I confirm that I have already paid the confirmed amount through GCash.
                  </label>
                  <button
                    type="button"
                    onClick={generateReceipt}
                    disabled={isSavingOrder}
                    className="mt-6 w-full rounded-full border-4 border-[#0756a8] bg-[#0756a8] px-6 py-4 font-black text-white transition hover:bg-[#064783] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSavingOrder ? "Saving Order..." : "Generate Receipt After Payment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === "receipt" && (
          <div>
            <div className="mb-8 print:hidden">
              <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">Receipt Ready</p>
              <h1 className="mt-2 text-4xl font-black text-[#0756a8] sm:text-5xl">Your Order Receipt</h1>
              <p className="mt-3 max-w-2xl font-semibold text-[#45627d]">
                Save this receipt, then send it to PotatoMania through our official Facebook or Instagram DM to continue your pre-order.
              </p>
            </div>

            <div id="potatomania-receipt" className="box-border mx-auto w-full max-w-2xl min-w-0 overflow-visible rounded-[2rem] border-4 border-[#0756a8] bg-white p-4 shadow-[8px_8px_0_#f28c28] sm:p-8">
              <div className="text-center">
                <img src="/potman-logo.png" alt="PotatoMania logo" className="mx-auto h-24 w-24 object-contain" />
                <p className="mt-3 text-sm font-black uppercase tracking-widest text-[#f28c28]">PotatoMania</p>
                <h2 className="mt-2 text-3xl font-black text-[#0756a8]">Order Receipt</h2>
                <p className="mt-2 text-sm font-semibold text-[#45627d]">Baked, Loaded & Loved.</p>
              </div>

              <div className="mt-6 rounded-2xl bg-[#fff4b8] p-4 text-center">
                <p className="text-sm font-black uppercase tracking-wide text-[#f28c28]">Order Number</p>
                <p className="mt-1 break-words text-2xl font-black leading-tight text-[#0756a8]">{orderId}</p>
                <p className="mt-2 text-sm font-bold text-[#45627d]">{orderDate}</p>
              </div>

              <div className="mt-6 space-y-3 border-b-2 border-[#e9f4ff] pb-6">
                <p className="font-bold text-[#45627d]"><span className="font-black text-[#0756a8]">Name:</span> {customerInfo.name}</p>
                <p className="font-bold text-[#45627d]"><span className="font-black text-[#0756a8]">Contact:</span> {customerInfo.contact}</p>
                <p className="font-bold text-[#45627d]"><span className="font-black text-[#0756a8]">Fulfillment:</span> {fulfillment === "Meetup" ? "Meet-up" : "Delivery"}</p>
                <p className="whitespace-pre-wrap font-bold text-[#45627d]"><span className="font-black text-[#0756a8]">Notes:</span> {customerInfo.notes.trim() ? customerInfo.notes : "No additional notes"}</p>
              </div>

              <div className="mt-6 space-y-4">
                {cart.map((item) => (
                  <div key={`receipt-item-${item.id}`} className="border-b-2 border-[#e9f4ff] pb-4">
                    <div className="flex min-w-0 flex-wrap items-start justify-between gap-x-4 gap-y-1">
                      <p className="min-w-0 break-words font-black text-[#0756a8]">{item.name}</p>
                      <p className="shrink-0 font-black text-[#0756a8]">×{item.quantity}</p>
                    </div>
                    {item.toppings.length > 0 && (
                      <p className="mt-1 text-sm font-semibold text-[#45627d]">Toppings: {item.toppings.map((topping) => `${topping.name} (+${formatPrice(topping.price)})`).join(", ")}</p>
                    )}
                    <p className="mt-1 font-bold text-[#f28c28]">{formatPrice(item.price)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#e9f4ff] p-4">
                <span className="font-black text-[#0756a8]">Total Items</span>
                <span className="text-2xl font-black text-[#0756a8]">{cartQuantity}</span>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#fff4b8] p-4">
                <span className="font-black text-[#0756a8]">Order Total</span>
                <span className="break-words text-2xl font-black text-[#0756a8]">{formatPrice(getCartTotal())}</span>
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-2xl space-y-3 print:hidden">
              <button type="button" onClick={downloadReceipt} className="w-full rounded-full border-4 border-[#0756a8] bg-[#0756a8] px-6 py-4 font-black text-white transition hover:bg-[#064783]">
                Save Receipt Image
              </button>
              <p className="text-center text-sm font-semibold leading-relaxed text-[#45627d]">
                Save the receipt image to your device, then send it to PotatoMania through our official Facebook or Instagram DM.
              </p>
              <button type="button" onClick={proceedToSuccess} className="w-full rounded-full border-4 border-[#0756a8] bg-white px-6 py-4 font-black text-[#0756a8] transition hover:bg-[#e9f4ff]">
                I’ve Saved My Receipt
              </button>
            </div>
          </div>
        )}

        {screen === "success" && (
          <div className="flex min-h-[65vh] items-center justify-center">
            <div className="w-full max-w-2xl rounded-[2.5rem] border-4 border-[#0756a8] bg-white p-8 text-center shadow-[10px_10px_0_#f28c28] sm:p-12">
              <div className="text-sm font-black uppercase tracking-widest text-[#f28c28]">Potatomania</div>

              <p className="mt-5 text-sm font-black uppercase tracking-[0.25em] text-[#f28c28]">
                Receipt Saved
              </p>

              <h1 className="mt-3 text-4xl font-black text-[#0756a8] sm:text-5xl">
                Thank you for ordering!
              </h1>

              <p className="mx-auto mt-5 max-w-xl font-semibold leading-relaxed text-[#45627d]">
                Your receipt is ready. Please send the saved receipt to PotatoMania
                through our official Facebook or Instagram DM so we can
                confirm your pre-order details.
              </p>

              <div className="mt-7 rounded-3xl bg-[#fff4b8] p-5">
                <p className="font-black text-[#0756a8]">
                  Order Status
                </p>

                <p className="mt-2 text-xl font-black text-[#f28c28]">
                  Awaiting DM Confirmation
                </p>
              </div>

              <p className="mt-5 text-sm font-semibold leading-relaxed text-[#45627d]">
                Please send your receipt through our official Facebook or Instagram DM.
                PotatoMania will confirm your order details and next steps.
              </p>

              <button
                type="button"
                onClick={resetOrder}
                className="mt-8 rounded-full border-4 border-[#0756a8] bg-[#0756a8] px-8 py-4 font-black text-white transition hover:bg-[#064783]"
              >
                Start a New Order
              </button>
            </div>
          </div>
        )}
      </section>

      {screen !== "welcome" &&
        screen !== "fulfillment" &&
        screen !== "cart" &&
        screen !== "checkout" &&
        screen !== "payment" &&
        screen !== "receipt" &&
        screen !== "success" &&
        cartQuantity > 0 && (
          <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full border-4 border-white bg-[#0756a8] p-2 shadow-2xl">
            <button
              type="button"
              onClick={goToCart}
              className="w-full rounded-full bg-white px-4 py-3 text-base font-black text-[#0756a8] transition hover:bg-[#fff4b8]"
            >
              View Cart ({cartQuantity})
            </button>
          </div>
        )}



      <footer className="mt-12 border-t-4 border-[#0756a8] bg-white px-5 py-6 text-center">
        <p className="font-black text-[#0756a8]">
          PotatoMania
        </p>

        <p className="mt-1 text-sm font-semibold text-[#45627d]">
          National University - Laguna
        </p>
      </footer>
    </main>
  );
}