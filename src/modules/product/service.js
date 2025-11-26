//SSR, SSG/ISR

const fetchProducts = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`
    );
    const data = await res.json();
    const arr = Array.isArray(data.data) ? data.data : [];
    return arr.map((p) => ({
      ...p,
      img: p.image,
      id: p.id,
      category: p.category?.toLowerCase() || "",
      brand: p.brand || "",
      price: p.price,
      name: p.name,
      description: p.description,
    }));
  } catch (err) {
    return [];
  }
};

const fetchProductById = async (id) => {
  try {
    // fetch detail produk bisa tetap pakai axios jika ingin
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${id}`
    );
    const data = await res.json();
    const p = data.data;
    return {
      ...p,
      seller_id: p.seller_id,
      img: p.image,
      id: p.id,
      category: p.category?.toLowerCase() || "",
      brand: p.brand || "",
      price: p.price,
      name: p.name,
      description: p.description,
    };
  } catch (err) {
    return null;
  }
};

const createProduct = async (payload) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    const p = data.data;
    return {
      ...p,
      img: p.image,
      id: p.id,
      category: p.category?.toLowerCase() || "",
      brand: p.brand || "",
      price: p.price,
      name: p.name,
      description: p.description,
    };
  } catch (err) {
    return null;
  }
};

const updateProduct = async (id, payload) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    const p = data.data;
    return {
      ...p,
      img: p.image,
      id: p.id,
      category: p.category?.toLowerCase() || "",
      brand: p.brand || "",
      price: p.price,
      name: p.name,
      description: p.description,
    };
  } catch (err) {
    return null;
  }
};

const deleteProduct = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${id}`,
      { method: "DELETE" }
    );
    return res.ok;
  } catch (err) {
    return false;
  }
};

export { fetchProducts, fetchProductById, createProduct, updateProduct, deleteProduct };
