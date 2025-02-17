"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useNotification } from "../components/Notification";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
function Login() {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  
  const searchParams = useSearchParams();
  console.log(searchParams.get(''));
  
  const callbackUrl = searchParams.get("callbackUrl");
  
  
  const { showNotification } = useNotification();
    const formik = useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: Yup.object({
        email: Yup.string()
          .email("Invalid email format")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),

      }),
      onSubmit: async (values) => {
       console.log("CallBack",callbackUrl);
        try {
          const res = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false
          })

          if (res?.error) {
            throw new Error(res.error);
          }
          showNotification("Login successful!", "success");
          router.push(callbackUrl || "/");
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
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium">Email:</label>
          <input
            type="email"
            name="email"
            className="input input-bordered w-full max-w-xs"
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
            className="input input-bordered w-full max-w-xs"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-xs">{formik.errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default Login