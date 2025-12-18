"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Select from "../ui/Select";
import Cookies from "js-cookie";

const RegisterForm = ({ onSuccess, onError }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "customer", // Default role
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
    // Clear role error when user selects a role
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validasi password match
    if (formData.password !== formData.password_confirmation) {
      setErrors({
        password_confirmation: "password tidak sesuai",
      });
      setIsLoading(false);
      return;
    }

    // Validasi role selection
    if (!formData.role) {
      setErrors({ role: "role tidak boleh kosong" });
      setIsLoading(false);
      return;
    }

    try {
      // Menggunakan API backend Laravel yang sebenarnya
      const response = await fetch("http://localhost:8000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.name.toLowerCase().replace(/\s+/g, ""),
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.errors) {
          const newErrors = {};
          Object.keys(data.errors).forEach((key) => {
            newErrors[key] = data.errors[key][0];
          });
          setErrors(newErrors);
          throw new Error("terjadi kesalahan");
        }
        throw new Error(data.message || "terjadi kesalahan");
      }

      // Simpan token dan user data dari response backend
      localStorage.setItem("token", data.access_token);
      const role = String(data?.user?.role || formData.role || "customer").toLowerCase();
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.user.email,
          username: data.user.username,
          role,
        })
      );
      Cookies.set("role", role, { sameSite: "lax" });
      Cookies.set("token", data.access_token, { sameSite: "lax" });

      onSuccess?.();
      router.push(role === "seller" ? "/seller/dashboard" : "/dashboard");
    } catch (error) {
      onError?.(error.message || "terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nama Lengkap"
          type="text"
          name="name"
          placeholder="Masukkan Nama Lengkap"
          value={formData.name}
          onChange={handleChange}
          required
          error={errors.name}
        />

        <Input
          label="Kata Sandi"
          type="password"
          name="password"
          placeholder="Buat Kata Sandi"
          value={formData.password}
          onChange={handleChange}
          required
          error={errors.password}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Masukkan Alamat Email"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
        />

        <Input
          label="Konfirmasi Kata Sandi"
          type="password"
          name="password_confirmation"
          placeholder="Konfirmasi Kata Sandi"
          value={formData.password_confirmation}
          onChange={handleChange}
          required
          error={errors.password_confirmation}
        />
      </div>

      <div className="mb-4">
        <Select
          label="Role"
          value={formData.role}
          onChange={handleRoleChange}
          options={[
            { value: "customer", label: "Customer (Buyer)" },
            { value: "seller", label: "Seller" },
          ]}
          placeholder="Pilih Role"
          required
          error={errors.role}
        />
      </div>

      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? "Mendaftar..." : "Daftar"}
      </Button>
    </form>
  );
};

export default RegisterForm;
