"use client";
import { useRouter } from "next/navigation";
import { useNotification } from "../components/Notification";
import { useFormik } from "formik";
import * as Yup from "yup";

function Register() {
  const router = useRouter();
  const { showNotification } = useNotification();

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email, password: values.password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Registration failed.");
        }

        showNotification("Registration successful! Please login.", "success");
        router.push("/login");
      } catch (error) {
        showNotification(
          error instanceof Error ? error.message : "Registration failed",
          "error"
        );
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={formik.handleSubmit} className="max-w-md w-full p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium">Email:</label>
          <input
            type="email"
            name="email"
            className="border p-2 w-full rounded"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-xs">{formik.errors.email}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Password:</label>
          <input
            type="password"
            name="password"
            className="border p-2 w-full rounded"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-xs">{formik.errors.password}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            className="border p-2 w-full rounded"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-xs">{formik.errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
