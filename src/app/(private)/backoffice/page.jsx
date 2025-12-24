"use client"

import { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, X, Edit2, Trash2, Plus } from "lucide-react"

const MOCK_USERS = Array.from({ length: 75 }, (_, i) => ({
  id: i + 1,
  name: "Aryo Jaty Pamungkas",
  email: "aryodarel@gmail.com",
  role: "Seller",
  date: "11/02/15",
  status: "pending",
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
}))

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Climacool 2020",
    price: 17,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Yeezy 700 V3",
    price: 17,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Climacool 2020",
    price: 17,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Yeezy 700 V3",
    price: 17,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300&h=300&fit=crop",
  },
]

const MOCK_BUYERS = Array.from({ length: 75 }, (_, i) => ({
  id: i + 1,
  productImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  category: "Shoe",
  code: i + 10000,
  time: "23:23",
  buyer: "Aryo Jaty Pamungkas",
  buyerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=buyer",
  status: "Processing",
}))

export default function BackofficeHome() {
  const [activeView, setActiveView] = useState("user-management")

  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [userCurrentPage, setUserCurrentPage] = useState(1)
  const [userItemsPerPage, setUserItemsPerPage] = useState(8)
  const [userActions, setUserActions] = useState({})

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(
      (user) =>
        user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchQuery.toLowerCase()),
    )
  }, [userSearchQuery])

  const userTotalPages = Math.ceil(filteredUsers.length / userItemsPerPage)
  const userStartIndex = (userCurrentPage - 1) * userItemsPerPage
  const paginatedUsers = filteredUsers.slice(userStartIndex, userStartIndex + userItemsPerPage)

  const handleUserAccept = (userId) => {
    setUserActions((prev) => ({ ...prev, [userId]: "accepted" }))
  }

  const handleUserDecline = (userId) => {
    setUserActions((prev) => ({ ...prev, [userId]: "declined" }))
  }

  const handleUserPageChange = (page) => {
    if (page >= 1 && page <= userTotalPages) {
      setUserCurrentPage(page)
    }
  }

  const handleUserItemsPerPageChange = (e) => {
    setUserItemsPerPage(Number.parseInt(e.target.value))
    setUserCurrentPage(1)
  }

  const [buyerSearchQuery, setBuyerSearchQuery] = useState("")
  const [buyerCurrentPage, setBuyerCurrentPage] = useState(1)
  const [buyerItemsPerPage, setBuyerItemsPerPage] = useState(8)
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [buyers, setBuyers] = useState(MOCK_BUYERS)
  const [editingBuyer, setEditingBuyer] = useState(null)
  const [showBuyerModal, setShowBuyerModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)

  const filteredBuyers = useMemo(() => {
    return buyers.filter(
      (buyer) =>
        buyer.buyer.toLowerCase().includes(buyerSearchQuery.toLowerCase()) ||
        buyer.category.toLowerCase().includes(buyerSearchQuery.toLowerCase()),
    )
  }, [buyerSearchQuery, buyers])

  const buyerTotalPages = Math.ceil(filteredBuyers.length / buyerItemsPerPage)
  const buyerStartIndex = (buyerCurrentPage - 1) * buyerItemsPerPage
  const paginatedBuyers = filteredBuyers.slice(buyerStartIndex, buyerStartIndex + buyerItemsPerPage)

  const handleBuyerPageChange = (page) => {
    if (page >= 1 && page <= buyerTotalPages) {
      setBuyerCurrentPage(page)
    }
  }

  const handleBuyerItemsPerPageChange = (e) => {
    setBuyerItemsPerPage(Number.parseInt(e.target.value))
    setBuyerCurrentPage(1)
  }

  const handleDeleteBuyer = (id) => {
    setBuyers(buyers.filter((buyer) => buyer.id !== id))
  }

  const handleEditBuyer = (buyer) => {
    setEditingBuyer(buyer)
    setShowBuyerModal(true)
  }

  const handleSaveEdit = (updatedBuyer) => {
    setBuyers(buyers.map((b) => (b.id === updatedBuyer.id ? updatedBuyer : b)))
    setEditingBuyer(null)
    setShowBuyerModal(false)
  }

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }])
    setShowProductModal(false)
  }

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-gray-900">

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-[#F7F7F8] border-r border-gray-200 min-h-screen flex flex-col">
          <div className="px-6 pt-8 pb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.16em] mb-4">
              Admin
            </h3>
            <nav className="space-y-2">
              <button
                type="button"
                onClick={() => setActiveView("user-management")}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === "user-management"
                  ? "bg-[#E53935] text-white shadow-sm hover:bg-[#D32F2F]"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <svg className="mr-3 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a6 6 0 00-9-5.497A4 4 0 00-2 13v1h20z" />
                </svg>
                Managemen User
              </button>

              <button
                type="button"
                onClick={() => setActiveView("super-admin")}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === "super-admin"
                  ? "bg-[#E53935] text-white shadow-sm hover:bg-[#D32F2F]"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <svg className="mr-3 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5M18.5 1.5v6M15.5 4.5h6" />
                </svg>
                Super Admin
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-10 py-8 space-y-12">
          {/* Managemen User Section */}
          {activeView === "user-management" && (
            <section className="space-y-6">
              <header className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-[#1F1F1F] tracking-tight">Managemen User</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Kelola pendaftaran dan status user seller di marketplace Anda.
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-3 text-sm text-gray-500">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    Last 7 Days
                  </span>
                </div>
              </header>

              {/* Search Bar */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Cari user berdasarkan nama atau email..."
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value)
                      setUserCurrentPage(1)
                    }}
                    className="w-full pl-4 pr-11 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E53935]/80 focus:border-transparent shadow-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#5B9FFF] text-white shadow-sm">
                    <Search size={15} />
                  </span>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Roles
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover shadow-sm"
                            />
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{user.email}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{user.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {userActions[user.id] === "accepted" ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-xs font-semibold text-green-700">
                                Accepted
                              </span>
                            ) : userActions[user.id] === "declined" ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-xs font-semibold text-red-700">
                                Declined
                              </span>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUserAccept(user.id)}
                                  className="px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-xs font-medium text-blue-700 border border-blue-100 transition-colors"
                                >
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUserDecline(user.id)}
                                  className="px-3 py-1.5 rounded-full bg-[#E53935] hover:bg-[#D32F2F] text-xs font-medium text-white shadow-sm transition-colors"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                <div className="text-sm text-gray-600">
                  Total User: <span className="font-semibold text-gray-900">{filteredUsers.length}</span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleUserPageChange(userCurrentPage - 1)}
                      disabled={userCurrentPage === 1}
                      className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {[...Array(Math.min(5, userTotalPages))].map((_, i) => {
                        const pageNum = i + 1
                        return (
                          <button
                            type="button"
                            key={pageNum}
                            onClick={() => handleUserPageChange(pageNum)}
                            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${userCurrentPage === pageNum
                              ? "bg-[#E53935] text-white shadow-sm"
                              : "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                              }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      {userTotalPages > 5 && (
                        <span className="px-1 text-xs text-gray-400 select-none">...</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUserPageChange(userCurrentPage + 1)}
                      disabled={userCurrentPage === userTotalPages}
                      className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                  <span>Show per page:</span>
                  <select
                    value={userItemsPerPage}
                    onChange={handleUserItemsPerPageChange}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E53935]/70 bg-white shadow-sm"
                  >
                    <option value={5}>5</option>
                    <option value={8}>8</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* Super Admin Section */}
          {activeView === "super-admin" && (
            <section className="space-y-8">
              <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-[#1F1F1F] tracking-tight">Super Admin</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Monitoring produk terbaru dan aktivitas buyer secara realtime.
                  </p>
                </div>
              </header>

              {/* Recently Added Products */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#1F1F1F]">Recently Added</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-square bg-gray-100">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full shadow-sm transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h4>
                        <button
                          type="button"
                          className="w-full bg-[#E53935] hover:bg-[#D32F2F] text-white py-2 rounded-full font-medium text-xs transition-colors shadow-sm"
                        >
                          Rp {product.price}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Product Card (dummy trigger, logic kept for future use) */}
                  <button
                    type="button"
                    onClick={() => setShowProductModal(true)}
                    className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
                      <Plus size={22} />
                    </div>
                    <span className="text-xs font-medium text-gray-500">Tambah Produk</span>
                  </button>
                </div>
              </div>

              {/* Monitoring Buyer */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#1F1F1F]">Monitoring Buyer</h3>
                </div>

                {/* Search Bar */}
                <div className="flex gap-4">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Cari buyer atau kategori..."
                      value={buyerSearchQuery}
                      onChange={(e) => {
                        setBuyerSearchQuery(e.target.value)
                        setBuyerCurrentPage(1)
                      }}
                      className="w-full pl-4 pr-11 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E53935]/80 focus:border-transparent shadow-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E53935] text-white shadow-sm">
                      <Search size={15} />
                    </span>
                  </div>
                </div>

                {/* Buyers Table */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Icon
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Code
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Buyer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBuyers.map((buyer) => (
                        <tr
                          key={buyer.id}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <img
                              src={buyer.productImage || "/placeholder.svg"}
                              alt="product"
                              className="w-9 h-9 rounded-lg object-cover shadow-sm"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{buyer.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{buyer.code}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{buyer.time}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <img
                                src={buyer.buyerImage || "/placeholder.svg"}
                                alt={buyer.buyer}
                                className="w-7 h-7 rounded-full object-cover shadow-sm"
                              />
                              <span className="text-sm text-gray-700">{buyer.buyer}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                              {buyer.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditBuyer(buyer)}
                                className="p-1.5 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBuyer(buyer.id)}
                                className="p-1.5 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                  <div className="text-sm text-gray-600">
                    Total User:{" "}
                    <span className="font-semibold text-gray-900">{filteredBuyers.length}</span>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleBuyerPageChange(buyerCurrentPage - 1)}
                        disabled={buyerCurrentPage === 1}
                        className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <div className="flex items-center gap-1.5">
                        {[...Array(Math.min(5, buyerTotalPages))].map((_, i) => {
                          const pageNum = i + 1
                          return (
                            <button
                              type="button"
                              key={pageNum}
                              onClick={() => handleBuyerPageChange(pageNum)}
                              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${buyerCurrentPage === pageNum
                                ? "bg-[#E53935] text-white shadow-sm"
                                : "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                                }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                        {buyerTotalPages > 5 && (
                          <span className="px-1 text-xs text-gray-400 select-none">...</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBuyerPageChange(buyerCurrentPage + 1)}
                        disabled={buyerCurrentPage === buyerTotalPages}
                        className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                    <span>Show per page:</span>
                    <select
                      value={buyerItemsPerPage}
                      onChange={handleBuyerItemsPerPageChange}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E53935]/70 bg-white shadow-sm"
                    >
                      <option value={5}>5</option>
                      <option value={8}>8</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Edit Buyer Modal */}
      {showBuyerModal && editingBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Buyer</h3>
              <button
                type="button"
                onClick={() => setShowBuyerModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Name</label>
                <input
                  type="text"
                  defaultValue={editingBuyer.buyer}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935]/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935]/80">
                  <option>Processing</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => handleSaveEdit({ ...editingBuyer })}
                className="w-full bg-[#E53935] text-white py-2.5 rounded-lg font-medium hover:bg-[#D32F2F] transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
