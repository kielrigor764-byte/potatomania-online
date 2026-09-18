"use client";

import { useEffect, useRef, useState } from "react";
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
  image: string;
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
  tornadoFlavor?: "Cheese" | "Sourcream" | "BBQ";
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
    image: "/category/spuds.png",
  },
  {
    id: "tornado",
    name: "Tornado Potato",
    description:
      "Crispy spiral potatoes with your choice of flavor.",
    image: "/category/tornado-potato.png",
  },
  {
    id: "iced-tea",
    name: "Iced Tea",
    description:
      "A refreshing drink to pair with your favorite snack.",
    image: "/category/iced-tea-refresher.png",
  },
  {
    id: "combo",
    name: "Combo Meals",
    description:
      "Delicious Potatomania favorites paired with iced tea.",
    image: "/category/combo-meals.png",
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
      "Bacon bits, white onion, carrots, and garlic mayo.",
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

  const [selectedTornadoFlavor, setSelectedTornadoFlavor] =
    useState<"Cheese" | "Sourcream" | "BBQ" | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [customerInfo, setCustomerInfo] =
    useState<CustomerInfo>({
      name: "",
      contact: "",
      notes: "",
    });

  const [orderId, setOrderId] = useState("");

  const [orderDate, setOrderDate] = useState("");

  type PaymentMethod = "GCash" | "Pay Upon Receiving" | null;

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>(null);

  const [gcashPaid, setGcashPaid] = useState(false);

  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);

  const [gcashReference, setGcashReference] = useState("");

  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const [isDrivingToMenu, setIsDrivingToMenu] = useState(false);

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
    setPaymentMethod(option === "Delivery" ? "GCash" : null);
    setGcashPaid(false);
    setPaymentScreenshot(null);
    setGcashReference("");

    // Play the PotatoMania ride animation first, then reveal the menu.
    setIsDrivingToMenu(true);

    window.setTimeout(() => {
      setIsDrivingToMenu(false);
      setScreen("categories");
    }, 1550);
  }

  function openCategory(categoryId: string) {
    setSelectedCategory(categoryId);
    setSelectedProduct(null);
    setSelectedToppings([]);
    setSelectedTornadoFlavor(null);
    setScreen("items");
  }

  function openProduct(product: Product) {
    setSelectedProduct(product);
    setSelectedToppings([]);
    setSelectedTornadoFlavor(null);
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

    const isComboTwo = selectedProduct.id === "combo-2";

    if (isComboTwo && !selectedTornadoFlavor) {
      alert("Please choose a Tornado Potato flavor first.");
      return;
    }

    const addOnTotal = selectedToppings.reduce((total, topping) => total + topping.price, 0);
    const itemName =
      isComboTwo && selectedTornadoFlavor
        ? `${selectedProduct.name} (${selectedTornadoFlavor})`
        : selectedProduct.name;

    const newCartItem: CartItem = {
      id: `${selectedProduct.id}-${cart.length}-${Date.now()}`,
      name: itemName,
      description: selectedProduct.description,
      basePrice: selectedProduct.price,
      price: selectedProduct.price + addOnTotal,
      quantity: 1,
      toppings: [...selectedToppings],
      tornadoFlavor: isComboTwo ? selectedTornadoFlavor ?? undefined : undefined,
    };

    setCart((currentCart) => [
      ...currentCart,
      newCartItem,
    ]);

    setSelectedProduct(null);
    setSelectedToppings([]);
    setSelectedTornadoFlavor(null);
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
    const isMeetup = fulfillment === "Meetup";
    const isPayUponReceiving =
      isMeetup && paymentMethod === "Pay Upon Receiving";

    if (!isMeetup && fulfillment !== "Delivery") {
      alert("Please select a fulfillment method first.");
      setScreen("fulfillment");
      return;
    }

    if (isMeetup && !paymentMethod) {
      alert("Please choose how you would like to pay for your meet-up order.");
      return;
    }

    if (!isPayUponReceiving) {
      if (!gcashPaid) {
        alert("Please confirm that you have completed your GCash payment first.");
        return;
      }

      if (!gcashReference.trim()) {
        alert("Please enter your GCash payment reference number.");
        return;
      }

      if (!paymentScreenshot) {
        alert(
          "Please upload a screenshot of your GCash payment before securing your pre-order.",
        );
        return;
      }
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

    try {
      let screenshotPublicUrl = "";

      if (paymentScreenshot) {
        const screenshotPath = `${newOrderId}/${Date.now()}-${paymentScreenshot.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
        const screenshotUploadUrl = `${supabaseUrl}/storage/v1/object/payment-screenshots/${screenshotPath}`;
        screenshotPublicUrl = `${supabaseUrl}/storage/v1/object/public/payment-screenshots/${screenshotPath}`;

        const uploadResponse = await fetch(screenshotUploadUrl, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type":
              paymentScreenshot.type || "application/octet-stream",
            "x-upsert": "false",
          },
          body: paymentScreenshot,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.text();
          throw new Error(
            uploadError || "The payment screenshot could not be uploaded.",
          );
        }
      }

      const orderPayload = {
        order_number: newOrderId,
        customer_name: customerInfo.name.trim(),
        customer_contact: customerInfo.contact.trim(),
        fulfillment_type: fulfillment ?? "Not specified",
        items: cart,
        total_amount: getCartTotal(),
        gcash_reference: isPayUponReceiving ? "" : gcashReference.trim(),
        payment_screenshot_url: isPayUponReceiving
          ? ""
          : screenshotPublicUrl,
        payment_status: isPayUponReceiving
          ? "Pay Upon Receiving"
          : "Pending",
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(`We could not save your order.\n\nDetails: ${errorMessage}`);
    } finally {
      setIsSavingOrder(false);
    }
  }

  async function downloadReceipt() {
    const receiptElement = document.getElementById("potatomania-receipt");

    if (!receiptElement) {
      alert(
        `${fulfillment === "Meetup" ? "Invoice" : "Receipt"} could not be found. Please try again.`,
      );
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
        throw new Error(
          `${fulfillment === "Meetup" ? "Invoice" : "Receipt"} image could not be created.`,
        );
      }

      const documentType = fulfillment === "Meetup" ? "Invoice" : "Receipt";
      const fileName = `PotatoMania-${documentType}-${orderId || "order"}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `PotatoMania ${documentType}`,
          text: `Here is my PotatoMania order ${documentType.toLowerCase()}.`,
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
            `Your browser blocked the ${documentType.toLowerCase()} image window. Please allow pop-ups for this site and try again.`,
          );
        } else {
          alert(
            `Your ${documentType.toLowerCase()} image is open in a new tab. Press and hold the image, then choose Save Image or Download Image.`,
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
      alert(
        `We could not create the ${
          fulfillment === "Meetup" ? "invoice" : "receipt"
        } image. Please try again.`,
      );
    } finally {
      captureHost?.remove();
    }
  }

  function proceedToSuccess() {
    setCart([]);
    setScreen("success");
  }

  function resetOrder() {
    setIsDrivingToMenu(false);
    setScreen("welcome");
    setFulfillment(null);
    setSelectedCategory(null);
    setSelectedProduct(null);
    setSelectedToppings([]);
    setSelectedTornadoFlavor(null);
    setCart([]);
    setCustomerInfo({
      name: "",
      contact: "",
      notes: "",
    });
    setOrderId("");
    setOrderDate("");
    setPaymentMethod(null);
    setGcashPaid(false);
    setPaymentScreenshot(null);
    setGcashReference("");
  }

  function goBackToCategories() {
    setSelectedCategory(null);
    setSelectedProduct(null);
    setSelectedToppings([]);
    setSelectedTornadoFlavor(null);
    setScreen("categories");
  }

  return (
    <main className="pm-shell relative min-h-screen overflow-x-hidden bg-[#f8fbff] pb-32 text-[#12304f]">
      <div className="pm-bg" aria-hidden="true">
        <span className="pm-orb pm-orb-blue" />
        <span className="pm-orb pm-orb-orange" />
        <span className="pm-orb pm-orb-light" />

        <span className="pm-potato pm-potato-one">🥔</span>
        <span className="pm-potato pm-potato-two">🥔</span>
        <span className="pm-potato pm-potato-three">🥔</span>
        <span className="pm-potato pm-potato-four">🥔</span>

        <span className="pm-cheese pm-cheese-one"><i /><i /><i /></span>
        <span className="pm-cheese pm-cheese-two"><i /><i /><i /></span>
        <span className="pm-cheese pm-cheese-three"><i /><i /><i /></span>
        <span className="pm-cheese pm-cheese-four"><i /><i /><i /></span>

        <span className="pm-spark pm-spark-one">✦</span>
        <span className="pm-spark pm-spark-two">✦</span>
        <span className="pm-spark pm-spark-three">✦</span>
        <span className="pm-spark pm-spark-four">✦</span>
      </div>
      <header className="pm-header relative z-20 border-b-4 border-[#0756a8] bg-white">
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
              <div className="pm-progress rounded-full bg-[#fff4b8] px-4 py-2 text-sm font-black text-[#0756a8]">
                {screen === "categories" && "Step 1 of 5"}
                {screen === "items" && "Step 2 of 5"}
                {screen === "cart" && "Step 3 of 5"}
                {screen === "checkout" && "Step 4 of 5"}
                {screen === "payment" && "Step 5 of 5"}
              </div>
            )}
        </div>
      </header>

      {isDrivingToMenu && (
        <div
          className="pm-drive-transition fixed inset-0 z-[100] overflow-hidden bg-[#fff8dc]"
          aria-live="polite"
          aria-label="PotatoMania crew driving to the menu"
        >
          <div className="pm-drive-sky" />
          <div className="pm-drive-glow pm-drive-glow-one" />
          <div className="pm-drive-glow pm-drive-glow-two" />

          <div className="pm-drive-speed pm-drive-speed-one" />
          <div className="pm-drive-speed pm-drive-speed-two" />
          <div className="pm-drive-speed pm-drive-speed-three" />
          <div className="pm-drive-speed pm-drive-speed-four" />
          <div className="pm-drive-speed pm-drive-speed-five" />
          <div className="pm-drive-speed pm-drive-speed-six" />

          <div className="pm-drive-road" />

          <div className="pm-drive-dust pm-drive-dust-one" />
          <div className="pm-drive-dust pm-drive-dust-two" />
          <div className="pm-drive-dust pm-drive-dust-three" />
          <div className="pm-drive-dust pm-drive-dust-four" />

          <div className="pm-drive-potatoes" aria-hidden="true">
            <span className="pm-drive-potato pm-drive-potato-01">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-02">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-03">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-04">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-05">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-06">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-07">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-08">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-09">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-10">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-11">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-12">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-13">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-14">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-15">🥔</span>
            <span className="pm-drive-potato pm-drive-potato-16">🥔</span>
          </div>

          <img
            src="/delivery.png"
            alt="PotatoMania crew driving"
            className="pm-drive-vehicle"
          />
        </div>
      )}

      <section className="pm-content relative z-10 mx-auto max-w-5xl px-5 py-8">
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
                    We will arrange a rider and you can
                    pay them directly upon arrival.
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
                  className="group rounded-[2rem] border-4 border-[#0756a8] bg-white p-6 text-left shadow-[6px_6px_0_#d8eaff] transition duration-300 hover:-translate-y-1 hover:bg-[#f0f7ff]"
                >
                  <div className="mb-6 flex h-44 items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-[#d8eaff] bg-[#fffdf1] p-4 sm:h-52">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-contain transition duration-500 ease-out group-hover:scale-105"
                    />
                  </div>

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
                  className={`pm-product-card rounded-[2rem] border-4 p-6 text-left transition hover:-translate-y-1 ${
                    product.id === "tornado-cheese"
                      ? "pm-tornado-cheese border-[#e3a51d] bg-[#fff0a6]/45 shadow-[6px_6px_0_rgba(227,165,29,.55)] hover:bg-[#fff0a6]/60"
                      : product.id === "tornado-sourcream"
                        ? "pm-tornado-sourcream border-[#7fa83d] bg-[#dff0a5]/45 shadow-[6px_6px_0_rgba(127,168,61,.55)] hover:bg-[#dff0a5]/60"
                        : product.id === "tornado-bbq"
                          ? "pm-tornado-bbq border-[#b95735] bg-[#e98458]/45 shadow-[6px_6px_0_rgba(185,87,53,.55)] hover:bg-[#e98458]/60"
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

                        {item.tornadoFlavor && (
                          <p className="mt-3 text-sm font-black text-[#0756a8]">
                            Tornado Potato Flavor: {item.tornadoFlavor}
                          </p>
                        )}

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
                      : "We will arrange a rider and you can pay them directly upon arrival."}
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

                        {item.tornadoFlavor && (
                          <p className="mt-1 text-sm font-semibold text-[#0756a8]">
                            Tornado Potato Flavor: {item.tornadoFlavor}
                          </p>
                        )}

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
                Review your order details and choose how you would like to
                complete payment before securing your pre-order.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-[2rem] border-4 border-[#0756a8] bg-white p-6 shadow-[6px_6px_0_#d8eaff]">
                  <h2 className="text-2xl font-black text-[#0756a8]">
                    Customer Information
                  </h2>
                  <div className="mt-5 space-y-3">
                    <div>
                      <p className="text-sm font-black uppercase tracking-wide text-[#f28c28]">
                        Full Name
                      </p>
                      <p className="mt-1 font-bold text-[#45627d]">
                        {customerInfo.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-wide text-[#f28c28]">
                        Contact
                      </p>
                      <p className="mt-1 font-bold text-[#45627d]">
                        {customerInfo.contact}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-wide text-[#f28c28]">
                        Notes
                      </p>
                      <p className="mt-1 whitespace-pre-wrap font-bold text-[#45627d]">
                        {customerInfo.notes.trim()
                          ? customerInfo.notes
                          : "No additional notes"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border-4 border-[#0756a8] bg-[#fff4b8] p-6">
                  <h2 className="text-2xl font-black text-[#0756a8]">
                    Fulfillment Method
                  </h2>
                  <p className="mt-3 font-black text-[#45627d]">
                    {fulfillment === "Meetup" ? "Meet-up" : "Delivery"}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[#45627d]">
                    {fulfillment === "Meetup"
                      ? "Meet-up availability and location will be announced on PotatoMania social media."
                      : "We will arrange a rider and you can pay them directly upon arrival"}
                  </p>
                </div>

                <div className="rounded-[2rem] border-4 border-[#0756a8] bg-white p-6 shadow-[6px_6px_0_#fff0a6]">
                  <h2 className="text-2xl font-black text-[#0756a8]">
                    Your Order
                  </h2>
                  <div className="mt-5 space-y-4">
                    {cart.map((item) => (
                      <div
                        key={`payment-item-${item.id}`}
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
                        {item.tornadoFlavor && (
                          <p className="mt-1 text-sm font-semibold text-[#0756a8]">
                            Tornado Potato Flavor: {item.tornadoFlavor}
                          </p>
                        )}

                        {item.toppings.length > 0 && (
                          <p className="mt-1 text-sm font-semibold text-[#45627d]">
                            Toppings:{" "}
                            {item.toppings
                              .map(
                                (topping) =>
                                  `${topping.name} (+${formatPrice(topping.price)})`,
                              )
                              .join(", ")}
                          </p>
                        )}
                        <p className="mt-1 font-bold text-[#f28c28]">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className="font-black text-[#0756a8]">
                      Total Items
                    </span>
                    <span className="text-2xl font-black text-[#0756a8]">
                      {cartQuantity}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4 border-t-2 border-[#e9f4ff] pt-4">
                    <span className="font-black text-[#0756a8]">
                      Order Total
                    </span>
                    <span className="text-2xl font-black text-[#0756a8]">
                      {formatPrice(getCartTotal())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {fulfillment === "Meetup" ? (
                  <div className="rounded-[2rem] border-4 border-[#0756a8] bg-[#fff4b8] p-6 shadow-[6px_6px_0_#d8eaff]">
                    <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                      Payment Options
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-[#0756a8]">
                      How would you like to pay?
                    </h2>
                    <p className="mt-4 font-semibold leading-relaxed text-[#45627d]">
                      For meet-up orders, you may pay when you receive your
                      order or pay through GCash in advance.
                    </p>

                    <div className="mt-5 grid gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod("Pay Upon Receiving");
                          setGcashPaid(false);
                          setPaymentScreenshot(null);
                          setGcashReference("");
                        }}
                        className={`rounded-2xl border-4 p-4 text-left transition ${
                          paymentMethod === "Pay Upon Receiving"
                            ? "border-[#0756a8] bg-[#0756a8] text-white"
                            : "border-[#0756a8] bg-white text-[#0756a8] hover:bg-[#e9f4ff]"
                        }`}
                      >
                        <p className="text-lg font-black">
                          Pay Upon Receiving
                        </p>
                        <p
                          className={`mt-1 text-sm font-semibold ${
                            paymentMethod === "Pay Upon Receiving"
                              ? "text-white/90"
                              : "text-[#45627d]"
                          }`}
                        >
                          No payment is required now. You will pay the exact
                          amount shown on your invoice when you receive your
                          order.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("GCash")}
                        className={`rounded-2xl border-4 p-4 text-left transition ${
                          paymentMethod === "GCash"
                            ? "border-[#0756a8] bg-[#0756a8] text-white"
                            : "border-[#0756a8] bg-white text-[#0756a8] hover:bg-[#e9f4ff]"
                        }`}
                      >
                        <p className="text-lg font-black">Pay via GCash</p>
                        <p
                          className={`mt-1 text-sm font-semibold ${
                            paymentMethod === "GCash"
                              ? "text-white/90"
                              : "text-[#45627d]"
                          }`}
                        >
                          Pay the confirmed amount in advance and submit your
                          payment details.
                        </p>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[2rem] border-4 border-[#0756a8] bg-[#fff4b8] p-6 shadow-[6px_6px_0_#d8eaff]">
                    <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                      Required Before Receipt
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-[#0756a8]">
                      Pay via GCash First
                    </h2>
                    <p className="mt-4 font-semibold leading-relaxed text-[#45627d]">
                      Delivery orders must be paid through GCash before the
                      pre-order can be secured.
                    </p>
                  </div>
                )}

                {(fulfillment === "Delivery" ||
                  paymentMethod === "GCash") && (
                  <div className="rounded-[2rem] border-4 border-[#0756a8] bg-[#fff4b8] p-6 shadow-[6px_6px_0_#d8eaff]">
                    <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                      GCash Payment
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-[#0756a8]">
                      Pay via GCash
                    </h2>
                    <p className="mt-4 font-semibold leading-relaxed text-[#45627d]">
                      Pay the confirmed Order Total using the GCash QR code or
                      GCash number below.
                    </p>

                    <div className="mt-5 rounded-2xl border-2 border-[#0756a8] bg-white p-4 text-center">
                      <p className="font-black text-[#0756a8]">
                        GCash Payment Details
                      </p>
                      <p className="mt-2 font-black text-[#0756a8]">
                        Scan the QR code to pay
                      </p>
                      <div className="mt-4 flex justify-center">
                        <img
                          src="/gcash-qr.jpeg"
                          alt="PotatoMania GCash QR code"
                          className="h-auto w-full max-w-[320px] rounded-xl object-contain"
                        />
                      </div>
                      <p className="mt-4 text-sm font-bold text-[#45627d]">
                        GCash Number
                      </p>
                      <p className="mt-1 text-2xl font-black tracking-wide text-[#0756a8]">
                        09568075788
                      </p>
                    </div>

                    <div className="mt-5 rounded-2xl border-2 border-[#0756a8] bg-white p-4">
                      <label
                        className="block font-black text-[#0756a8]"
                        htmlFor="gcash-reference"
                      >
                        GCash Payment Reference Number
                      </label>
                      <p className="mt-2 text-sm font-semibold leading-relaxed text-[#45627d]">
                        Enter the reference number shown on your successful
                        GCash transaction.
                      </p>
                      <input
                        id="gcash-reference"
                        type="text"
                        value={gcashReference}
                        onChange={(event) =>
                          setGcashReference(event.target.value)
                        }
                        placeholder="Enter GCash reference number"
                        className="mt-3 block w-full rounded-xl border-2 border-[#d8eaff] bg-white p-3 text-sm font-bold text-[#45627d] outline-none focus:border-[#0756a8]"
                      />
                    </div>

                    <div className="mt-5 rounded-2xl border-2 border-[#0756a8] bg-white p-4">
                      <label
                        className="block font-black text-[#0756a8]"
                        htmlFor="payment-screenshot"
                      >
                        Upload GCash Payment Screenshot
                      </label>
                      <p className="mt-2 text-sm font-semibold leading-relaxed text-[#45627d]">
                        Upload a clear screenshot of your successful GCash
                        payment. This is required before your pre-order can be
                        secured.
                      </p>
                      <input
                        id="payment-screenshot"
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          setPaymentScreenshot(
                            event.target.files?.[0] ?? null,
                          )
                        }
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
                      I confirm that I have already paid the confirmed amount
                      through GCash.
                    </label>
                  </div>
                )}

                {fulfillment === "Meetup" &&
                  paymentMethod === "Pay Upon Receiving" && (
                    <div className="rounded-[2rem] border-4 border-[#0756a8] bg-white p-6 shadow-[6px_6px_0_#fff0a6]">
                      <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                        No Payment Required Now
                      </p>
                      <h2 className="mt-2 text-3xl font-black text-[#0756a8]">
                        Pay when you receive your order
                      </h2>
                      <p className="mt-4 font-semibold leading-relaxed text-[#45627d]">
                        You can finalize your meet-up order now. Your invoice
                        will show the exact amount due when you receive your
                        order.
                      </p>
                    </div>
                  )}

                <button
                  type="button"
                  onClick={generateReceipt}
                  disabled={
                    isSavingOrder ||
                    (fulfillment === "Meetup" && !paymentMethod)
                  }
                  className="w-full rounded-full border-4 border-[#0756a8] bg-[#0756a8] px-6 py-4 font-black text-white transition hover:bg-[#064783] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingOrder
                    ? "Saving Order..."
                    : fulfillment === "Meetup"
                      ? "Finalize Meet-up Order"
                      : "Generate Receipt After Payment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === "receipt" && (
          <div>
            <div className="mb-8 print:hidden">
              <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                {fulfillment === "Meetup" ? "Invoice Ready" : "Receipt Ready"}
              </p>
              <h1 className="mt-2 text-4xl font-black text-[#0756a8] sm:text-5xl">
                {fulfillment === "Meetup"
                  ? "Your Order Invoice"
                  : "Your Order Receipt"}
              </h1>
              <p className="mt-3 max-w-2xl font-semibold text-[#45627d]">
                {fulfillment === "Meetup"
                  ? "Save this invoice. It contains the details of your meet-up order and the amount due when you receive it."
                  : "Save this receipt, then send it to PotatoMania through our official Facebook or Instagram DM to continue your pre-order."}
              </p>
            </div>

            <div id="potatomania-receipt" className="box-border mx-auto w-full max-w-2xl min-w-0 overflow-visible rounded-[2rem] border-4 border-[#0756a8] bg-white p-4 shadow-[8px_8px_0_#f28c28] sm:p-8">
              <div className="text-center">
                <img src="/potman-logo.png" alt="PotatoMania logo" className="mx-auto h-24 w-24 object-contain" />
                <p className="mt-3 text-sm font-black uppercase tracking-widest text-[#f28c28]">PotatoMania</p>
                <h2 className="mt-2 text-3xl font-black text-[#0756a8]">
                  {fulfillment === "Meetup" ? "Order Invoice" : "Order Receipt"}
                </h2>
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
                {fulfillment === "Meetup" && (
                  <p className="font-bold text-[#45627d]">
                    <span className="font-black text-[#0756a8]">Payment:</span>{" "}
                    {paymentMethod}
                  </p>
                )}
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
                <span className="font-black text-[#0756a8]">
                  {fulfillment === "Meetup" ? "Amount Due" : "Order Total"}
                </span>
                <span className="break-words text-2xl font-black text-[#0756a8]">
                  {formatPrice(getCartTotal())}
                </span>
              </div>

              {fulfillment === "Meetup" &&
                paymentMethod === "Pay Upon Receiving" && (
                  <div className="mt-6 rounded-2xl border-4 border-[#0756a8] bg-[#e9f4ff] p-5 text-center">
                    <p className="text-sm font-black uppercase tracking-widest text-[#f28c28]">
                      Payment Due Upon Receiving
                    </p>
                    <p className="mt-2 text-3xl font-black text-[#0756a8]">
                      {formatPrice(getCartTotal())}
                    </p>
                    <p className="mt-2 text-sm font-bold leading-relaxed text-[#45627d]">
                      Please prepare the exact amount when you receive your
                      meet-up order.
                    </p>
                  </div>
                )}
            </div>

            <div className="mx-auto mt-6 max-w-2xl space-y-3 print:hidden">
              <button type="button" onClick={downloadReceipt} className="w-full rounded-full border-4 border-[#0756a8] bg-[#0756a8] px-6 py-4 font-black text-white transition hover:bg-[#064783]">
                Save {fulfillment === "Meetup" ? "Invoice" : "Receipt"} Image
              </button>
              <p className="text-center text-sm font-semibold leading-relaxed text-[#45627d]">
                {fulfillment === "Meetup"
                  ? "Save the invoice image to your device. It contains the amount due and order details for your meet-up."
                  : "Save the receipt image to your device, then send it to PotatoMania through our official Facebook or Instagram DM."}
              </p>
              <button type="button" onClick={proceedToSuccess} className="w-full rounded-full border-4 border-[#0756a8] bg-white px-6 py-4 font-black text-[#0756a8] transition hover:bg-[#e9f4ff]">
                I’ve Saved My {fulfillment === "Meetup" ? "Invoice" : "Receipt"}
              </button>
            </div>
          </div>
        )}

        {screen === "success" && (
          <div className="flex min-h-[65vh] items-center justify-center">
            <div className="w-full max-w-2xl rounded-[2.5rem] border-4 border-[#0756a8] bg-white p-8 text-center shadow-[10px_10px_0_#f28c28] sm:p-12">
              <div className="text-sm font-black uppercase tracking-widest text-[#f28c28]">Potatomania</div>

              <p className="mt-5 text-sm font-black uppercase tracking-[0.25em] text-[#f28c28]">
                {fulfillment === "Meetup" ? "Invoice Ready" : "Receipt Saved"}
              </p>

              <h1 className="mt-3 text-4xl font-black text-[#0756a8] sm:text-5xl">
                Thank you for ordering!
              </h1>

              <p className="mx-auto mt-5 max-w-xl font-semibold leading-relaxed text-[#45627d]">
                {fulfillment === "Meetup"
                  ? paymentMethod === "Pay Upon Receiving"
                    ? "Your invoice is ready. Please save it and send it to PotatoMania through our official Facebook or Instagram DM so we can confirm your meet-up pre-order."
                    : "Your invoice is ready. Please save it and send it to PotatoMania through our official Facebook or Instagram DM so we can confirm your meet-up pre-order."
                  : "Your receipt is ready. Please send the saved receipt to PotatoMania through our official Facebook or Instagram DM so we can confirm your pre-order details."}
              </p>

              <div className="mt-7 rounded-3xl bg-[#fff4b8] p-5">
                <p className="font-black text-[#0756a8]">
                  Order Status
                </p>

                <p className="mt-2 text-xl font-black text-[#f28c28]">
                  {fulfillment === "Meetup"
                    ? "Awaiting DM Confirmation"
                    : "Awaiting DM Confirmation"}
                </p>
              </div>

              <p className="mt-5 text-sm font-semibold leading-relaxed text-[#45627d]">
                {fulfillment === "Meetup"
                  ? "Please send your invoice through our official Facebook or Instagram DM. PotatoMania will confirm your order details and meet-up instructions."
                  : "Please send your receipt through our official Facebook or Instagram DM. PotatoMania will confirm your order details and next steps."}
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

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain p-4 sm:p-6">
          <div className="pm-modal-card max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-x-hidden overflow-y-auto overscroll-contain rounded-[2rem] border-2 border-white/75 bg-white/30 p-6 shadow-[8px_10px_0_rgba(242,140,40,.62)] sm:max-h-[90vh] sm:p-8">
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
            setSelectedTornadoFlavor(null);
                }}
                className="rounded-full bg-[#e9f4ff] px-4 py-2 font-black text-[#0756a8] hover:bg-[#d8ebff]"
              >
                Close
              </button>
            </div>

            <p className="mt-4 font-semibold leading-relaxed text-[#45627d]">
              {selectedProduct.description}
            </p>

            {selectedProduct.id === "combo-2" && (
              <div className="mt-7">
                <h3 className="text-xl font-black text-[#0756a8]">
                  Choose your Tornado Potato flavor
                </h3>

                <p className="mt-1 text-sm font-semibold text-[#45627d]">
                  Pick one flavor for your Combo 2.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {(["Cheese", "Sourcream", "BBQ"] as const).map((flavor) => {
                    const isSelected = selectedTornadoFlavor === flavor;

                    return (
                      <button
                        key={`combo-2-flavor-${flavor}`}
                        type="button"
                        onClick={() => setSelectedTornadoFlavor(flavor)}
                        className={`pm-flavor-option rounded-2xl border-2 px-4 py-4 text-center font-black transition backdrop-blur-xl ${
                          flavor === "Cheese"
                            ? isSelected
                              ? "border-[#e3a51d] bg-[#fff0a6]/80 text-[#7a5600] shadow-[0_0_22px_rgba(227,165,29,0.35)]"
                              : "border-[#e3a51d]/70 bg-[#fff0a6]/35 text-[#7a5600] hover:bg-[#fff0a6]/60"
                            : flavor === "Sourcream"
                              ? isSelected
                                ? "border-[#7fa83d] bg-[#dff0a5]/80 text-[#4d6820] shadow-[0_0_22px_rgba(127,168,61,0.35)]"
                                : "border-[#7fa83d]/70 bg-[#dff0a5]/35 text-[#4d6820] hover:bg-[#dff0a5]/60"
                              : isSelected
                                ? "border-[#b95735] bg-[#e98458]/80 text-[#6e2815] shadow-[0_0_22px_rgba(185,87,53,0.35)]"
                                : "border-[#b95735]/70 bg-[#e98458]/35 text-[#6e2815] hover:bg-[#e98458]/60"
                        }`}
                      >
                        {isSelected ? "✓ " : ""}
                        {flavor}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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
            setSelectedTornadoFlavor(null);
                }}
                className="rounded-full border-4 border-[#0756a8] px-6 py-3 font-black text-[#0756a8] transition hover:bg-[#e9f4ff]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {screen !== "welcome" &&
        screen !== "fulfillment" &&
        screen !== "cart" &&
        screen !== "checkout" &&
        screen !== "payment" &&
        screen !== "receipt" &&
        screen !== "success" &&
        cartQuantity > 0 && (
          <div className="pm-floating-cart fixed inset-x-0 bottom-5 z-50 mx-auto w-[calc(100%-2rem)] max-w-md rounded-full border-4 border-white bg-[#0756a8] p-2 shadow-2xl">
            <button
              type="button"
              onClick={goToCart}
              className="w-full rounded-full bg-white px-4 py-3 text-base font-black text-[#0756a8] transition hover:bg-[#fff4b8]"
            >
              View Cart ({cartQuantity})
            </button>
          </div>
        )}



      <style jsx>{`
        .pm-shell {
          isolation: isolate;
        }

        .pm-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .pm-bg::before,
        .pm-bg::after {
          content: "";
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
        }

        .pm-bg::before {
          width: 42vw;
          height: 42vw;
          min-width: 260px;
          min-height: 260px;
          left: -18vw;
          top: 35%;
          background: radial-gradient(circle, rgba(7, 86, 168, .08), transparent 68%);
          animation: pmAmbient 13s ease-in-out infinite;
        }

        .pm-bg::after {
          width: 38vw;
          height: 38vw;
          min-width: 240px;
          min-height: 240px;
          right: -14vw;
          top: 8%;
          background: radial-gradient(circle, rgba(242, 140, 40, .10), transparent 68%);
          animation: pmAmbient 16s ease-in-out infinite reverse;
        }

        .pm-orb {
          position: absolute;
          display: block;
          border-radius: 9999px;
          filter: blur(2px);
          opacity: .55;
          animation: pmOrbFloat 12s ease-in-out infinite;
        }

        .pm-orb-blue {
          width: 18px;
          height: 18px;
          left: 9%;
          top: 24%;
          background: rgba(7, 86, 168, .25);
          box-shadow: 0 0 24px rgba(7, 86, 168, .18);
        }

        .pm-orb-orange {
          width: 13px;
          height: 13px;
          right: 15%;
          top: 54%;
          background: rgba(242, 140, 40, .35);
          box-shadow: 0 0 22px rgba(242, 140, 40, .2);
          animation-delay: -4s;
        }

        .pm-orb-light {
          width: 10px;
          height: 10px;
          left: 22%;
          bottom: 18%;
          background: rgba(255, 216, 74, .45);
          box-shadow: 0 0 20px rgba(255, 216, 74, .22);
          animation-delay: -8s;
        }

        .pm-potato {
          position: absolute;
          display: block;
          font-size: 34px;
          line-height: 1;
          opacity: .12;
          filter: blur(.15px);
          transform-origin: center;
          animation: pmPotatoFloat 11s ease-in-out infinite;
        }

        .pm-potato-one {
          left: 4%;
          top: 18%;
          animation-delay: -2s;
          transform: rotate(-12deg);
        }

        .pm-potato-two {
          right: 5%;
          top: 34%;
          font-size: 27px;
          animation-delay: -7s;
          transform: rotate(14deg);
        }

        .pm-potato-three {
          left: 7%;
          bottom: 19%;
          font-size: 25px;
          animation-delay: -9s;
          transform: rotate(8deg);
        }

        .pm-potato-four {
          right: 11%;
          bottom: 10%;
          font-size: 31px;
          animation-delay: -5s;
          transform: rotate(-15deg);
        }

        .pm-cheese {
          position: absolute;
          width: 96px;
          height: 34px;
          border-radius: 0 0 24px 24px;
          background: linear-gradient(180deg, #ffe06a 0%, #f5b91b 100%);
          opacity: .24;
          filter: blur(.15px) drop-shadow(0 8px 12px rgba(242, 140, 40, .12));
          animation: pmCheeseFloat 10s ease-in-out infinite;
        }

        .pm-cheese::before {
          content: "";
          position: absolute;
          left: 8px;
          right: 8px;
          top: -7px;
          height: 14px;
          border-radius: 50%;
          background: #ffe06a;
        }

        .pm-cheese i {
          position: absolute;
          display: block;
          bottom: -20px;
          width: 13px;
          border-radius: 0 0 12px 12px;
          background: linear-gradient(180deg, #ffd84a 0%, #f5b91b 100%);
          transform-origin: top center;
          animation: pmDrip 4.5s ease-in-out infinite;
        }

        .pm-cheese i:nth-child(1) { left: 16px; height: 22px; animation-delay: -.8s; }
        .pm-cheese i:nth-child(2) { left: 43px; width: 16px; height: 38px; animation-delay: -2.1s; }
        .pm-cheese i:nth-child(3) { right: 14px; width: 11px; height: 19px; animation-delay: -3.2s; }

        .pm-cheese-one { left: 2%; top: 31%; transform: rotate(-7deg); animation-delay: -2s; }
        .pm-cheese-two { right: 2%; top: 67%; width: 78px; height: 28px; transform: rotate(8deg) scale(.86); animation-delay: -6s; }
        .pm-cheese-three { right: 9%; top: 13%; width: 64px; height: 25px; transform: rotate(-5deg) scale(.74); animation-delay: -9s; }
        .pm-cheese-four { left: 12%; bottom: 8%; width: 70px; height: 26px; transform: rotate(5deg) scale(.78); animation-delay: -4s; }

        .pm-spark {
          position: absolute;
          display: block;
          color: #f28c28;
          font-size: 20px;
          opacity: .28;
          text-shadow: 0 0 14px rgba(242, 140, 40, .24);
          animation: pmSpark 3.8s ease-in-out infinite;
        }

        .pm-spark-one { left: 13%; top: 12%; }
        .pm-spark-two { right: 18%; top: 23%; font-size: 15px; animation-delay: -1.2s; }
        .pm-spark-three { left: 18%; bottom: 13%; font-size: 14px; animation-delay: -2.4s; }
        .pm-spark-four { right: 8%; bottom: 22%; font-size: 19px; animation-delay: -3s; }

        .pm-header {
          background: rgba(255, 255, 255, .68) !important;
          -webkit-backdrop-filter: blur(20px) saturate(1.18);
          backdrop-filter: blur(20px) saturate(1.18);
          box-shadow: 0 8px 30px rgba(18, 48, 79, .08);
          border-bottom-color: rgba(7, 86, 168, .72) !important;
          animation: pmHeaderFloat .8s cubic-bezier(.2,.75,.25,1) both;
        }

        .pm-header::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,.45) 42%, transparent 58%);
          transform: translateX(-120%);
          animation: pmHeaderShine 7s ease-in-out infinite;
        }

        .pm-content .grid > button,
        .pm-content .space-y-5 > div,
        .pm-content > div > .rounded-\[2rem\],
        .pm-content > div > .rounded-\[2\.5rem\] {
          -webkit-backdrop-filter: blur(12px) saturate(1.08);
          backdrop-filter: blur(12px) saturate(1.08);
          transform-style: preserve-3d;
          will-change: transform, box-shadow;
        }

        .pm-content .grid > button {
          transition:
            transform .38s cubic-bezier(.2,.75,.25,1),
            box-shadow .38s ease,
            border-color .3s ease,
            filter .38s ease;
        }

        .pm-content .grid > button:hover {
          transform: translateY(-8px) rotateX(1.2deg) rotateY(-1deg);
          box-shadow:
            0 18px 36px rgba(18,48,79,.14),
            0 0 0 1px rgba(255,255,255,.65) inset,
            0 0 28px rgba(7,86,168,.08);
          filter: saturate(1.04);
        }

        .pm-content .grid > button:active {
          transform: translateY(-1px) scale(.985);
        }

        .pm-content .grid > button::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          background: radial-gradient(circle at 18% 8%, rgba(255,255,255,.62), transparent 34%);
          transition: opacity .35s ease;
        }

        .pm-content .grid > button:hover::before {
          opacity: 1;
        }

        .pm-content .grid > button > div:first-child {
          transform: translateZ(6px);
        }

        .pm-content .grid > button:hover img {
          transform: scale(1.08) rotate(-2deg) translateY(-2px);
          filter: drop-shadow(0 14px 18px rgba(18,48,79,.16));
        }

        .pm-content .grid > button img {
          transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .45s ease;
        }

        .pm-content .rounded-\[2rem\],
        .pm-content .rounded-\[2\.5rem\] {
          box-shadow: 8px 10px 0 rgba(242,140,40,.72), 0 18px 42px rgba(18,48,79,.07);
          transition: transform .4s cubic-bezier(.2,.75,.25,1), box-shadow .4s ease;
        }

        .pm-content .rounded-\[2rem\]:hover,
        .pm-content .rounded-\[2\.5rem\]:hover {
          box-shadow: 10px 16px 0 rgba(242,140,40,.78), 0 24px 50px rgba(18,48,79,.11);
        }

        .pm-content button:not(.grid > button) {
          transition: transform .25s cubic-bezier(.2,.75,.25,1), box-shadow .25s ease, background-color .25s ease, filter .25s ease;
        }

        .pm-content button:not(.grid > button):hover {
          filter: brightness(1.02);
        }

        .pm-content a,
        .pm-content button {
          -webkit-tap-highlight-color: transparent;
        }

        .pm-modal-card {
          position: relative;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: rgba(7,86,168,.42) transparent;
          overflow-x: hidden;
          overflow-y: auto;
          isolation: isolate;
          background: linear-gradient(135deg, rgba(255,255,255,.52), rgba(255,255,255,.20) 48%, rgba(255,255,255,.34)) !important;
          -webkit-backdrop-filter: blur(30px) saturate(1.45) contrast(1.03);
          backdrop-filter: blur(30px) saturate(1.45) contrast(1.03);
          border-color: rgba(255,255,255,.78) !important;
          box-shadow:
            10px 12px 0 rgba(242,140,40,.62),
            0 28px 70px rgba(18,48,79,.22),
            0 0 0 1px rgba(255,255,255,.88) inset,
            0 0 42px rgba(255,255,255,.22);
          animation: pmModalIn .42s cubic-bezier(.2,.8,.2,1) both;
          transition: transform .45s cubic-bezier(.2,.75,.25,1), box-shadow .45s ease;
        }

        .pm-modal-card::-webkit-scrollbar {
          width: 8px;
        }

        .pm-modal-card::-webkit-scrollbar-track {
          background: transparent;
        }

        .pm-modal-card::-webkit-scrollbar-thumb {
          border-radius: 9999px;
          background: rgba(7,86,168,.34);
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .pm-modal-card::-webkit-scrollbar-thumb:hover {
          background: rgba(7,86,168,.55);
          background-clip: padding-box;
        }

        .pm-modal-card:hover {
          transform: translateY(-3px);
          box-shadow:
            12px 16px 0 rgba(242,140,40,.68),
            0 34px 82px rgba(18,48,79,.25),
            0 0 0 1px rgba(255,255,255,.92) inset,
            0 0 55px rgba(255,255,255,.28);
        }

        .pm-modal-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(circle at 12% 8%, rgba(255,255,255,.80), transparent 24%),
            radial-gradient(circle at 88% 92%, rgba(255,216,74,.18), transparent 30%),
            linear-gradient(120deg, rgba(255,255,255,.18), transparent 38%, rgba(255,255,255,.12) 72%, transparent);
        }

        .pm-modal-card::after {
          content: "";
          position: absolute;
          top: -55%;
          left: -80%;
          width: 42%;
          height: 210%;
          pointer-events: none;
          z-index: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.58), transparent);
          transform: rotate(18deg);
          animation: pmModalShine 7s ease-in-out infinite;
        }

        .pm-modal-card > * {
          position: relative;
          z-index: 1;
        }

        .pm-modal-card h2,
        .pm-modal-card h3,
        .pm-modal-card p,
        .pm-modal-card label {
          text-shadow: 0 1px 10px rgba(255,255,255,.38);
        }

        .pm-modal-card .rounded-2xl {
          background: rgba(255,255,255,.30) !important;
          border-color: rgba(255,255,255,.70) !important;
          -webkit-backdrop-filter: blur(16px) saturate(1.25);
          backdrop-filter: blur(16px) saturate(1.25);
          box-shadow: 0 8px 22px rgba(18,48,79,.07), 0 0 0 1px rgba(255,255,255,.25) inset;
          transition: transform .25s ease, box-shadow .25s ease, background-color .25s ease;
        }

        .pm-modal-card .rounded-2xl:hover {
          background: rgba(255,255,255,.46) !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(18,48,79,.10), 0 0 0 1px rgba(255,255,255,.48) inset;
        }

        .pm-modal-card button {
          -webkit-tap-highlight-color: transparent;
        }

        .pm-modal-card > div:first-child > button {
          background: rgba(255,255,255,.42) !important;
          border: 1px solid rgba(255,255,255,.72);
          -webkit-backdrop-filter: blur(14px);
          backdrop-filter: blur(14px);
          box-shadow: 0 6px 18px rgba(18,48,79,.08), 0 0 0 1px rgba(255,255,255,.22) inset;
          transition: transform .25s ease, background-color .25s ease, box-shadow .25s ease;
        }

        .pm-modal-card > div:first-child > button:hover {
          transform: rotate(2deg) scale(1.04);
          background: rgba(255,255,255,.64) !important;
          box-shadow: 0 10px 24px rgba(18,48,79,.12), 0 0 0 1px rgba(255,255,255,.42) inset;
        }

        .pm-floating-cart {
          -webkit-backdrop-filter: blur(18px) saturate(1.15);
          backdrop-filter: blur(18px) saturate(1.15);
          box-shadow: 0 16px 36px rgba(18,48,79,.18);
          animation: pmCartFloat 3.5s ease-in-out infinite;
        }

        .pm-floating-cart button:hover {
          transform: translateY(-2px) scale(1.015);
          box-shadow: 0 8px 20px rgba(7,86,168,.14);
        }

        .pm-progress {
          animation: pmProgressPulse 2.8s ease-in-out infinite;
        }

        .pm-content > div {
          animation: pmSectionIn .55s cubic-bezier(.2, .75, .25, 1) both;
        }

        .pm-content button {
          position: relative;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
        }

        .pm-content button::after {
          content: "";
          position: absolute;
          top: -60%;
          left: -70%;
          width: 38%;
          height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.48), transparent);
          transform: rotate(20deg);
          transition: left .65s ease;
          pointer-events: none;
        }

        .pm-content button:hover::after {
          left: 135%;
        }

        .pm-content button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 26px rgba(7, 86, 168, .13);
        }

        .pm-content button:active {
          transform: translateY(1px) scale(.985);
          transition-duration: .08s;
        }

        .pm-content img {
          transition: transform .45s cubic-bezier(.2, .75, .25, 1), filter .45s ease;
        }

        .pm-content img:hover {
          transform: scale(1.045) rotate(-1.5deg);
          filter: drop-shadow(0 10px 16px rgba(18, 48, 79, .12));
        }

        .pm-content input,
        .pm-content textarea {
          transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease, background-color .25s ease;
        }

        .pm-content input:focus,
        .pm-content textarea:focus {
          border-color: #0756a8 !important;
          background-color: #ffffff;
          box-shadow: 0 0 0 4px rgba(7, 86, 168, .10), 0 8px 20px rgba(7, 86, 168, .08);
          transform: translateY(-1px);
        }

        .pm-content [class*="shadow-["] {
          transition: transform .3s ease, box-shadow .3s ease, background-color .3s ease;
        }

        .pm-content [class*="shadow-["]:hover {
          transform: translateY(-3px);
        }

        .pm-content .grid > button:nth-child(1),
        .pm-content .space-y-5 > div:nth-child(1) { animation-delay: .04s; }
        .pm-content .grid > button:nth-child(2),
        .pm-content .space-y-5 > div:nth-child(2) { animation-delay: .10s; }
        .pm-content .grid > button:nth-child(3),
        .pm-content .space-y-5 > div:nth-child(3) { animation-delay: .16s; }
        .pm-content .grid > button:nth-child(4),
        .pm-content .space-y-5 > div:nth-child(4) { animation-delay: .22s; }
        .pm-content .grid > button:nth-child(5),
        .pm-content .space-y-5 > div:nth-child(5) { animation-delay: .28s; }
        .pm-content .grid > button:nth-child(6),
        .pm-content .space-y-5 > div:nth-child(6) { animation-delay: .34s; }
        .pm-content .grid > button:nth-child(7),
        .pm-content .space-y-5 > div:nth-child(7) { animation-delay: .40s; }
        .pm-content .grid > button:nth-child(8),
        .pm-content .space-y-5 > div:nth-child(8) { animation-delay: .46s; }
        .pm-content .grid > button:nth-child(9),
        .pm-content .space-y-5 > div:nth-child(9) { animation-delay: .52s; }

        .pm-footer {
          background: rgba(255, 255, 255, .88) !important;
          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
        }

        @keyframes pmSectionIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pmAmbient {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(24px, -18px, 0) scale(1.06); }
        }

        @keyframes pmOrbFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(18px, -24px, 0); }
        }

        @keyframes pmPotatoFloat {
          0%, 100% { margin-top: 0; }
          50% { margin-top: -16px; }
        }

        @keyframes pmCheeseFloat {
          0%, 100% { margin-top: 0; }
          50% { margin-top: -18px; }
        }

        @keyframes pmDrip {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.12); }
        }

        @keyframes pmSpark {
          0%, 100% { opacity: .18; transform: translateY(4px) scale(.8) rotate(0deg); }
          50% { opacity: .5; transform: translateY(-7px) scale(1.1) rotate(18deg); }
        }

        @keyframes pmHeaderFloat {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pmHeaderShine {
          0%, 72%, 100% { transform: translateX(-120%); }
          84% { transform: translateX(120%); }
        }

        @keyframes pmModalIn {
          from { opacity: 0; transform: translateY(18px) scale(.96) rotateX(2deg); filter: blur(3px); }
          to { opacity: 1; transform: translateY(0) scale(1) rotateX(0); filter: blur(0); }
        }

        @keyframes pmModalShine {
          0%, 58%, 100% { left: -80%; opacity: 0; }
          64% { opacity: .72; }
          76% { left: 145%; opacity: 0; }
        }

        @keyframes pmGlassBreath {
          0%, 100% { transform: translate3d(-2%, -1%, 0) scale(.95); opacity: .55; }
          50% { transform: translate3d(5%, 4%, 0) scale(1.05); opacity: .9; }
        }

        @keyframes pmCartFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes pmProgressPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(7, 86, 168, 0); }
          50% { box-shadow: 0 0 0 5px rgba(7, 86, 168, .08); }
        }

        .pm-drive-transition {
          isolation: isolate;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pmDriveFadeIn .12s ease-out both;
        }

        .pm-drive-sky {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 38%, rgba(255,255,255,.98) 0 12%, transparent 44%),
            linear-gradient(180deg, #fff8dc 0%, #f7fbff 48%, #dbeeff 100%);
          z-index: -5;
        }

        .pm-drive-glow {
          position: absolute;
          width: 42vw;
          height: 42vw;
          max-width: 520px;
          max-height: 520px;
          border-radius: 999px;
          filter: blur(35px);
          opacity: .38;
          animation: pmDriveGlow 1.55s ease-in-out both;
          z-index: -4;
        }

        .pm-drive-glow-one {
          left: -8vw;
          top: 5vh;
          background: rgba(242,140,40,.28);
        }

        .pm-drive-glow-two {
          right: -10vw;
          bottom: -8vh;
          background: rgba(7,86,168,.22);
          animation-delay: -.2s;
        }

        .pm-drive-road {
          position: absolute;
          left: -10%;
          right: -10%;
          bottom: -23%;
          height: 48%;
          transform: perspective(500px) rotateX(62deg);
          transform-origin: bottom;
          background: linear-gradient(180deg, rgba(7,86,168,.06), rgba(18,48,79,.16));
          border-top: 5px solid rgba(7,86,168,.12);
          z-index: -2;
        }

        .pm-drive-speed {
          position: absolute;
          height: 5px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(7,86,168,.22), #f28c28);
          transform: translateX(-120vw) rotate(-8deg);
          animation: pmDriveSpeed .7s linear infinite;
          z-index: -1;
        }

        .pm-drive-speed-one { top: 16%; width: 31vw; animation-delay: -.08s; }
        .pm-drive-speed-two { top: 27%; width: 22vw; animation-delay: -.22s; }
        .pm-drive-speed-three { top: 39%; width: 38vw; animation-delay: -.36s; }
        .pm-drive-speed-four { top: 52%; width: 27vw; animation-delay: -.48s; }
        .pm-drive-speed-five { top: 66%; width: 45vw; animation-delay: -.60s; }
        .pm-drive-speed-six { top: 78%; width: 34vw; animation-delay: -.34s; }

        .pm-drive-dust {
          position: absolute;
          width: 110px;
          height: 52px;
          border-radius: 50%;
          background: rgba(255,255,255,.78);
          filter: blur(6px);
          opacity: 0;
          animation: pmDriveDust .85s ease-out both;
          z-index: 1;
        }

        .pm-drive-dust-one { bottom: 29%; left: 7%; animation-delay: .28s; }
        .pm-drive-dust-two { bottom: 24%; left: 14%; animation-delay: .40s; transform: scale(.72); }
        .pm-drive-dust-three { bottom: 32%; left: 21%; animation-delay: .50s; transform: scale(.55); }
        .pm-drive-dust-four { bottom: 27%; left: 29%; animation-delay: .58s; transform: scale(.40); }

        .pm-drive-potatoes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 3;
        }

        .pm-drive-potato {
          position: absolute;
          top: -12vh;
          display: block;
          font-size: clamp(24px, 3.2vw, 48px);
          line-height: 1;
          opacity: 0;
          filter: drop-shadow(0 7px 7px rgba(18,48,79,.16));
          will-change: transform, opacity;
          animation: pmDrivePotatoFall 1.5s cubic-bezier(.2,.72,.18,1) both;
        }

        .pm-drive-potato-01 { left: 4%;  animation-delay: .02s; --potato-x: 13vw; --potato-r: 310deg; }
        .pm-drive-potato-02 { left: 11%; animation-delay: .16s; --potato-x: -8vw; --potato-r: 220deg; font-size: 28px; }
        .pm-drive-potato-03 { left: 18%; animation-delay: .30s; --potato-x: 18vw; --potato-r: 390deg; font-size: 42px; }
        .pm-drive-potato-04 { left: 26%; animation-delay: .07s; --potato-x: -13vw; --potato-r: 250deg; font-size: 32px; }
        .pm-drive-potato-05 { left: 34%; animation-delay: .24s; --potato-x: 10vw; --potato-r: 340deg; }
        .pm-drive-potato-06 { left: 42%; animation-delay: .38s; --potato-x: -16vw; --potato-r: 280deg; font-size: 29px; }
        .pm-drive-potato-07 { left: 50%; animation-delay: .10s; --potato-x: 15vw; --potato-r: 430deg; font-size: 40px; }
        .pm-drive-potato-08 { left: 58%; animation-delay: .27s; --potato-x: -11vw; --potato-r: 330deg; font-size: 31px; }
        .pm-drive-potato-09 { left: 65%; animation-delay: .04s; --potato-x: 14vw; --potato-r: 290deg; }
        .pm-drive-potato-10 { left: 72%; animation-delay: .20s; --potato-x: -17vw; --potato-r: 410deg; font-size: 35px; }
        .pm-drive-potato-11 { left: 79%; animation-delay: .34s; --potato-x: 9vw; --potato-r: 360deg; font-size: 27px; }
        .pm-drive-potato-12 { left: 86%; animation-delay: .12s; --potato-x: -12vw; --potato-r: 235deg; font-size: 44px; }
        .pm-drive-potato-13 { left: 93%; animation-delay: .31s; --potato-x: 8vw; --potato-r: 385deg; font-size: 30px; }
        .pm-drive-potato-14 { left: 7%;  animation-delay: .48s; --potato-x: 23vw; --potato-r: 500deg; font-size: 26px; }
        .pm-drive-potato-15 { left: 55%; animation-delay: .52s; --potato-x: -20vw; --potato-r: 460deg; font-size: 25px; }
        .pm-drive-potato-16 { left: 88%; animation-delay: .43s; --potato-x: 16vw; --potato-r: 520deg; font-size: 33px; }

        .pm-drive-vehicle {
          position: absolute;
          width: min(92vw, 1200px);
          max-height: 84vh;
          object-fit: contain;
          left: 50%;
          top: 52%;
          transform: translate(-175vw, -50%) rotate(-2deg) scale(.68);
          filter: drop-shadow(0 22px 22px rgba(18,48,79,.22));
          animation: pmDriveVehicle 1.45s linear both;
          z-index: 2;
          pointer-events: none;
          user-select: none;
          will-change: transform, filter;
        }

        @keyframes pmDriveFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pmDriveVehicle {
          /* One uninterrupted pass: the tricycle never stops or lingers in the middle. */
          0% {
            transform: translate(-175vw, -50%) rotate(-2deg) scale(.68);
            filter: blur(0) drop-shadow(0 18px 20px rgba(18,48,79,.12));
          }

          25% {
            transform: translate(-88vw, -50%) rotate(-1deg) scale(.78);
            filter: blur(.15px) drop-shadow(0 21px 22px rgba(18,48,79,.16));
          }

          50% {
            transform: translate(0vw, -50%) rotate(0deg) scale(.96);
            filter: blur(.35px) drop-shadow(0 24px 24px rgba(18,48,79,.19));
          }

          75% {
            transform: translate(88vw, -50%) rotate(1deg) scale(1.10);
            filter: blur(1px) drop-shadow(0 27px 27px rgba(18,48,79,.21));
          }

          100% {
            transform: translate(175vw, -50%) rotate(2deg) scale(1.28);
            filter: blur(2.5px) drop-shadow(0 30px 30px rgba(18,48,79,.18));
          }
        }

        @keyframes pmDrivePotatoFall {
          0% {
            opacity: 0;
            transform: translate3d(0, -14vh, 0) rotate(0deg) scale(.45);
          }

          12% {
            opacity: .98;
          }

          42% {
            opacity: 1;
          }

          78% {
            opacity: .92;
          }

          100% {
            opacity: 0;
            transform: translate3d(var(--potato-x), 116vh, 0) rotate(var(--potato-r)) scale(1);
          }
        }

        @keyframes pmDriveSpeed {
          from {
            transform: translateX(-120vw) rotate(-8deg);
            opacity: 0;
          }

          12% {
            opacity: .9;
          }

          to {
            transform: translateX(130vw) rotate(-8deg);
            opacity: 0;
          }
        }

        @keyframes pmDriveDust {
          0% {
            opacity: 0;
            transform: translate(0, 8px) scale(.25);
          }

          25% {
            opacity: .7;
          }

          100% {
            opacity: 0;
            transform: translate(-80px, -18px) scale(1.45);
          }
        }

        @keyframes pmDriveGlow {
          0% { opacity: .18; transform: scale(.72); }
          45% { opacity: .42; transform: scale(1); }
          100% { opacity: .08; transform: scale(1.25); }
        }

        /* Responsive layout: keep the kiosk intact from small phones to large screens. */
        .pm-shell,
        .pm-content,
        .pm-header,
        .pm-footer {
          min-width: 0;
        }

        .pm-content {
          width: 100%;
        }

        .pm-modal-card {
          width: min(100%, 42rem);
          max-width: calc(100vw - 2rem);
          max-height: calc(100dvh - 2rem);
          min-height: 0;
          overscroll-behavior: contain;
          touch-action: pan-y;
        }

        .pm-modal-card img {
          max-width: 100%;
        }

        .pm-floating-cart {
          bottom: max(1.25rem, env(safe-area-inset-bottom));
        }

        @media (max-width: 900px) {
          .pm-content {
            max-width: 100% !important;
          }

          .pm-header > div {
            max-width: 100% !important;
          }

          .pm-content .grid > button {
            min-width: 0;
          }
        }

        @media (max-width: 640px) {
          .pm-potato { font-size: 25px; opacity: .09; }
          .pm-cheese { opacity: .18; transform: scale(.78); }
          .pm-spark { font-size: 15px; }
          .pm-orb { opacity: .35; }

          .pm-header {
            border-bottom-width: 3px !important;
          }

          .pm-header > div {
            gap: .65rem;
            padding-left: .85rem !important;
            padding-right: .85rem !important;
            padding-top: .7rem !important;
            padding-bottom: .7rem !important;
          }

          .pm-header > div > button {
            min-width: 0;
            flex: 1 1 auto;
          }

          .pm-header > div > button img {
            height: 2.75rem !important;
            width: 2.75rem !important;
            flex: 0 0 auto;
          }

          .pm-header > div > button p:first-child {
            font-size: .95rem !important;
          }

          .pm-header > div > button p:last-child {
            font-size: .58rem !important;
            letter-spacing: .06em !important;
            white-space: nowrap;
          }

          .pm-progress {
            flex: 0 0 auto;
            padding: .45rem .65rem !important;
            font-size: .68rem !important;
            white-space: nowrap;
          }

          .pm-content {
            padding-left: .85rem !important;
            padding-right: .85rem !important;
            padding-top: 1.25rem !important;
          }

          .pm-content h1 {
            font-size: clamp(1.85rem, 8vw, 2.5rem);
            line-height: 1.05;
            overflow-wrap: anywhere;
          }

          .pm-content h2 {
            overflow-wrap: anywhere;
          }

          .pm-content .grid {
            gap: .8rem;
          }

          .pm-content .grid > button {
            padding: 1rem !important;
            border-width: 3px !important;
            border-radius: 1.5rem !important;
          }

          .pm-content .grid > button > div:first-child {
            min-height: 7rem;
          }

          .pm-content .grid > button img {
            max-width: 100%;
          }

          .pm-content .rounded-\[2rem\],
          .pm-content .rounded-\[2\.5rem\] {
            border-width: 3px;
          }

          .pm-floating-cart {
            width: calc(100% - 1rem);
            max-width: 28rem;
            bottom: max(.55rem, env(safe-area-inset-bottom));
            padding: .35rem;
            border-width: 3px;
          }

          .pm-floating-cart button {
            min-height: 3.15rem;
          }

          .pm-modal-card {
            max-width: calc(100vw - 1rem);
            max-height: calc(100dvh - 1rem);
            border-radius: 1.45rem !important;
            border-width: 2px !important;
            padding: 1rem !important;
            box-shadow:
              6px 8px 0 rgba(242,140,40,.58),
              0 18px 44px rgba(18,48,79,.22),
              0 0 0 1px rgba(255,255,255,.88) inset,
              0 0 30px rgba(255,255,255,.20);
          }

          .pm-modal-card > div:first-child {
            gap: .65rem;
          }

          .pm-modal-card > div:first-child > div {
            min-width: 0;
          }

          .pm-modal-card > div:first-child > div p {
            font-size: .65rem;
            line-height: 1.2;
          }

          .pm-modal-card > div:first-child > div h2 {
            margin-top: .35rem;
            font-size: clamp(1.45rem, 7vw, 2rem);
            line-height: 1.05;
          }

          .pm-modal-card > div:first-child > button {
            flex: 0 0 auto;
            padding: .55rem .75rem !important;
            font-size: .8rem;
          }

          .pm-modal-card .grid.sm\:grid-cols-2 {
            grid-template-columns: 1fr !important;
          }

          .pm-modal-card .rounded-2xl {
            min-width: 0;
          }

          .pm-modal-card button {
            overflow-wrap: anywhere;
          }

          .pm-modal-card .flex.sm\:flex-row {
            flex-direction: column !important;
          }

          .pm-modal-card .flex.sm\:flex-row > button {
            width: 100%;
          }

          .pm-modal-card::after {
            animation-duration: 8s;
          }

          /* Prevent touch devices from getting a hover-style lift after tapping. */
          @media (hover: none) {
            .pm-content button:hover,
            .pm-content .grid > button:hover,
            .pm-content .rounded-\[2rem\]:hover,
            .pm-content .rounded-\[2\.5rem\]:hover,
            .pm-modal-card:hover,
            .pm-modal-card .rounded-2xl:hover {
              transform: none;
            }
          }
        }

        @media (max-width: 380px) {
          .pm-header > div > button p:first-child {
            font-size: .82rem !important;
          }

          .pm-header > div > button p:last-child {
            font-size: .5rem !important;
          }

          .pm-header > div > button img {
            height: 2.4rem !important;
            width: 2.4rem !important;
          }

          .pm-progress {
            padding: .38rem .5rem !important;
            font-size: .6rem !important;
          }

          .pm-content {
            padding-left: .65rem !important;
            padding-right: .65rem !important;
          }

          .pm-content .grid {
            grid-template-columns: 1fr !important;
          }

          .pm-modal-card {
            max-width: calc(100vw - .6rem);
            max-height: calc(100dvh - .6rem);
            padding: .8rem !important;
            border-radius: 1.25rem !important;
          }

          .pm-modal-card .mt-7 {
            margin-top: 1.15rem !important;
          }

          .pm-modal-card .mt-8 {
            margin-top: 1.15rem !important;
          }

          .pm-modal-card .rounded-2xl {
            padding: .7rem !important;
          }

          .pm-floating-cart {
            width: calc(100% - .7rem);
          }
        }

        @media (max-height: 560px) and (orientation: landscape) {
          .pm-content {
            padding-top: .8rem !important;
            padding-bottom: 6rem !important;
          }

          .pm-modal-card {
            max-height: calc(100dvh - .75rem);
            padding: .8rem !important;
          }

          .pm-modal-card > div:first-child > div h2 {
            font-size: 1.4rem;
          }

          .pm-modal-card .mt-7,
          .pm-modal-card .mt-8 {
            margin-top: .9rem !important;
          }
        }

        /* Global glassmorphism: keep every major kiosk panel visually consistent. */
        .pm-header,
        .pm-footer {
          background: linear-gradient(135deg, rgba(255,255,255,.62), rgba(255,255,255,.28) 52%, rgba(255,244,184,.34)) !important;
          -webkit-backdrop-filter: blur(22px) saturate(1.35);
          backdrop-filter: blur(22px) saturate(1.35);
          border-color: rgba(255,255,255,.72) !important;
          box-shadow: 0 10px 32px rgba(18,48,79,.08), 0 0 0 1px rgba(255,255,255,.38) inset;
        }

        .pm-content .rounded-\[2rem\],
        .pm-content .rounded-\[2\.5rem\],
        .pm-content .rounded-3xl {
          background: linear-gradient(135deg, rgba(255,255,255,.52), rgba(255,255,255,.24) 55%, rgba(255,244,184,.22)) !important;
          -webkit-backdrop-filter: blur(20px) saturate(1.3);
          backdrop-filter: blur(20px) saturate(1.3);
          border-color: rgba(255,255,255,.72) !important;
          box-shadow:
            8px 10px 0 rgba(242,140,40,.42),
            0 18px 42px rgba(18,48,79,.10),
            0 0 0 1px rgba(255,255,255,.30) inset;
        }

        .pm-content .rounded-\[2rem\]:hover,
        .pm-content .rounded-\[2\.5rem\]:hover,
        .pm-content .rounded-3xl:hover {
          background: linear-gradient(135deg, rgba(255,255,255,.64), rgba(255,255,255,.34) 55%, rgba(255,244,184,.28)) !important;
          border-color: rgba(255,255,255,.88) !important;
          box-shadow:
            10px 14px 0 rgba(242,140,40,.50),
            0 24px 52px rgba(18,48,79,.13),
            0 0 0 1px rgba(255,255,255,.48) inset;
        }

        /* The checkout/receipt image must stay opaque so saved receipts remain clean. */
        .pm-content #potatomania-receipt {
          background: #ffffff !important;
          -webkit-backdrop-filter: none !important;
          backdrop-filter: none !important;
          border-color: #0756a8 !important;
          box-shadow: 8px 8px 0 #f28c28 !important;
        }

        .pm-content #potatomania-receipt .rounded-2xl {
          -webkit-backdrop-filter: none !important;
          backdrop-filter: none !important;
        }

        /* Standalone Tornado Potato cards keep their original flavor colors while using the same glassmorphism. */
        .pm-content .pm-product-card.pm-tornado-cheese,
        .pm-content .pm-product-card.pm-tornado-sourcream,
        .pm-content .pm-product-card.pm-tornado-bbq {
          -webkit-backdrop-filter: blur(18px) saturate(1.3);
          backdrop-filter: blur(18px) saturate(1.3);
          border-width: 2px !important;
          box-shadow:
            6px 6px 0 rgba(18,48,79,.10),
            0 18px 40px rgba(18,48,79,.10),
            0 0 0 1px rgba(255,255,255,.38) inset !important;
        }

        .pm-content .pm-product-card.pm-tornado-cheese {
          background: linear-gradient(135deg, rgba(255,240,166,.62), rgba(255,255,255,.28) 55%, rgba(227,165,29,.20)) !important;
          border-color: rgba(227,165,29,.78) !important;
        }

        .pm-content .pm-product-card.pm-tornado-sourcream {
          background: linear-gradient(135deg, rgba(223,240,165,.62), rgba(255,255,255,.28) 55%, rgba(127,168,61,.20)) !important;
          border-color: rgba(127,168,61,.78) !important;
        }

        .pm-content .pm-product-card.pm-tornado-bbq {
          background: linear-gradient(135deg, rgba(233,132,88,.58), rgba(255,255,255,.28) 55%, rgba(185,87,53,.20)) !important;
          border-color: rgba(185,87,53,.78) !important;
        }

        .pm-content .pm-product-card.pm-tornado-cheese:hover {
          background: linear-gradient(135deg, rgba(255,240,166,.76), rgba(255,255,255,.38) 55%, rgba(227,165,29,.28)) !important;
          box-shadow: 8px 10px 0 rgba(227,165,29,.34), 0 24px 48px rgba(18,48,79,.13), 0 0 0 1px rgba(255,255,255,.52) inset !important;
        }

        .pm-content .pm-product-card.pm-tornado-sourcream:hover {
          background: linear-gradient(135deg, rgba(223,240,165,.76), rgba(255,255,255,.38) 55%, rgba(127,168,61,.28)) !important;
          box-shadow: 8px 10px 0 rgba(127,168,61,.34), 0 24px 48px rgba(18,48,79,.13), 0 0 0 1px rgba(255,255,255,.52) inset !important;
        }

        .pm-content .pm-product-card.pm-tornado-bbq:hover {
          background: linear-gradient(135deg, rgba(233,132,88,.72), rgba(255,255,255,.38) 55%, rgba(185,87,53,.28)) !important;
          box-shadow: 8px 10px 0 rgba(185,87,53,.34), 0 24px 48px rgba(18,48,79,.13), 0 0 0 1px rgba(255,255,255,.52) inset !important;
        }

        /* Combo 2 flavor choices use the exact same glass-card treatment as the other modal choices. */
        .pm-modal-card .pm-flavor-option {
          background: rgba(255,255,255,.30) !important;
          border-color: rgba(255,255,255,.72) !important;
          -webkit-backdrop-filter: blur(16px) saturate(1.25);
          backdrop-filter: blur(16px) saturate(1.25);
          box-shadow: 0 8px 22px rgba(18,48,79,.07), 0 0 0 1px rgba(255,255,255,.25) inset;
        }

        .pm-modal-card .pm-flavor-option:hover {
          background: rgba(255,255,255,.46) !important;
          border-color: rgba(255,255,255,.92) !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(18,48,79,.10), 0 0 0 1px rgba(255,255,255,.48) inset;
        }

        @media (prefers-reduced-motion: reduce) {
          .pm-bg *,
          .pm-bg::before,
          .pm-bg::after,
          .pm-progress,
          .pm-content > div,
          .pm-drive-transition *,
          .pm-drive-transition,
          .pm-modal-card,
          .pm-modal-card::before,
          .pm-floating-cart,
          .pm-header::after {
            animation: none !important;
          }

          .pm-content button,
          .pm-content img,
          .pm-content input,
          .pm-content textarea,
          .pm-content [class*="shadow-["] {
            transition: none !important;
          }

          .pm-content button::after {
            display: none;
          }
        }
      `}</style>


      <footer className="pm-footer relative z-10 mt-12 border-t-4 border-[#0756a8] bg-white px-5 py-6 text-center">
        <p className="font-black text-[#0756a8]">
          Potatomania
        </p>

        <p className="mt-1 text-sm font-semibold text-[#45627d]">
          National University - Laguna
        </p>
      </footer>
    </main>
  );
} 