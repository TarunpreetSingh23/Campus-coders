"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, LogIn, UserPlus, ArrowLeft } from "lucide-react";

// --- Form Element Components ---

/**
 * Reusable Input Field Component
 */
const InputField = ({ label, type = "text", value, onChange, required, icon: Icon, placeholder }) => (
  <label className="block w-full">
    <div className="text-sm text-gray-600 font-medium mb-1 flex items-center gap-1">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />} {label}
    </div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/10 text-white placeholder-gray-300 
                 focus:border-[#5d7afc] focus:ring-2 focus:ring-[#5d7afc]/40 outline-none transition duration-200"
    />
  </label>
);

// --- Framer Motion Variants ---

const formVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  }),
};

// --- Form Components ---

const SignUpForm = ({ username, setUsername, email, setEmail, password, setPassword, handleSignUp, loading, error, success, direction }) => (
    <motion.form
        key="signup"
        custom={direction}
        variants={formVariants}
        initial="enter"
        animate="center"
        exit="exit"
        onSubmit={handleSignUp}
        className="absolute inset-0 flex flex-col gap-4"
    >
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>

        <InputField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required icon={User} placeholder="Choose a username" />
        <InputField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required icon={Mail} placeholder="name@example.com" />
        <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required icon={Lock} placeholder="••••••••" />

        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <motion.button type="submit" disabled={loading} className="mt-4 w-full py-3 rounded-xl bg-[#5d7afc] text-white font-bold text-lg shadow-lg hover:bg-[#002366] transition duration-200 disabled:opacity-50" whileTap={{ scale: 0.98 }}>
            {loading ? "Registering..." : "Create Account"}
        </motion.button>
    </motion.form>
);

const LoginForm = ({ email, setEmail, password, setPassword, handleLogin, loading, error, success, direction }) => (
    <motion.form
        key="login"
        custom={direction}
        variants={formVariants}
        initial="enter"
        animate="center"
        exit="exit"
        onSubmit={handleLogin}
        className="absolute inset-0 flex flex-col gap-4"
    >
        <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>

        <InputField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required icon={Mail} placeholder="name@example.com" />
        <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required icon={Lock} placeholder="••••••••" />

        <p className="text-sm text-right text-[#5d7afc] hover:text-[#002366] cursor-pointer transition">Forgot Password?</p>

        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <motion.button type="submit" disabled={loading} className="mt-6 w-full py-3 rounded-xl bg-[#5d7afc] text-white font-bold text-lg shadow-lg hover:bg-[#002366] transition duration-200 disabled:opacity-50" whileTap={{ scale: 0.98 }}>
            {loading ? "Signing In..." : "Sign In"}
        </motion.button>
    </motion.form>
);

/**
 * Reusable Alert Component
 */
const Alert = ({ type, children }) => {
    const isError = type === 'error';
    const classes = isError
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700";

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-3 rounded-xl text-sm font-medium ${classes}`}>
            {children}
        </motion.div>
    );
};

// --- Main Component ---

export default function AuthPage() {
    const router = useRouter();
    // useSession is included, but not actively used for redirect logic here, which is fine.
    // const { data: session } = useSession(); 
    
    const [mode, setMode] = useState("signup");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [direction, setDirection] = useState(1);

    const navigateAfterAuth = () => router.back();
    
    const resetFormState = (newMode) => {
        setDirection(newMode === "signup" ? 1 : -1);
        setMode(newMode);
        setError("");
        setSuccess("");
        setUsername("");
        setEmail("");
        setPassword("");
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(""); setSuccess(""); setLoading(true);

        if (!username || !email || !password) {
            setError("All fields are required."); setLoading(false); return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long."); setLoading(false); return;
        }

        try {
            // Note: The /api/register route is assumed to exist.
            const res = await fetch("/api/register", {
                method: "POST", headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();
            
            if (!res.ok) { 
                setError(data.message || "Failed to register user. Email might be in use."); 
                return;
            }

            setSuccess("Registration successful! Logging in...");
            const loginRes = await signIn("credentials", { redirect: false, email, password });
            
            if (!loginRes?.error) { 
                setTimeout(navigateAfterAuth, 600);
            } else { 
                setError("Login failed after registration. Please try logging in manually."); 
            }
        } catch { 
            setError("A network error occurred. Please try again."); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); setSuccess(""); setLoading(true);
        if (!email || !password) { setError("Email and password are required."); setLoading(false); return; }

        try {
            const res = await signIn("credentials", { redirect: false, email, password });
            
            if (res?.error) { 
                setError("Invalid email or password.");
            } else { 
                setSuccess("Login successful! Redirecting..."); 
                setTimeout(navigateAfterAuth, 600); 
            }
        } catch { 
            setError("A network error occurred. Please try again."); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <main className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
            
            {/* Background Ornaments (kept as is for visual appeal) */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-[#5d7afc]/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#002366]/20 rounded-full blur-3xl animate-pulse-slow"></div>

            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative z-10">

                {/* Left Promotional/Info Panel (kept as is) */}
                <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#5d7afc] to-[#002366] text-white">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-4 leading-snug">Seamless Home Services, Just a Click Away</h1>
                        <p className="text-indigo-100 text-lg mb-8">
                            Join **Swiftly** today to book trusted cleaning, beauty, and repair services quickly and easily.
                        </p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="mt-auto self-start flex items-center gap-2 py-2 px-4 text-sm font-semibold rounded-full border border-white/50 hover:bg-white/10 transition"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                </div>

                {/* Right Authentication Form Panel */}
                <div className="p-4 sm:p-12 relative">
                    
                    {/* Toggle Buttons */}
                    <div className="flex bg-gray-100/30 p-1 rounded-full mb-8 shadow-inner">
                        {["signup", "login"].map((m) => {
                            const isActive = mode === m;
                            return (
                                <button
                                    key={m}
                                    onClick={() => resetFormState(m)}
                                    className={`flex-1 py-2 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                                        isActive ? "bg-[#5d7afc] text-white shadow-md" : "text-gray-700 hover:bg-white/30"
                                    }`}
                                >
                                    {m === "signup" ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />} {m === "signup" ? "Sign Up" : "Log In"}
                                </button>
                            );
                        })}
                    </div>

                    {/* Animated Form Container */}
                    <div className="relative h-[400px] overflow-hidden">
                        <AnimatePresence initial={false} custom={direction}>
                            {mode === "signup" ? (
                                <SignUpForm
                                    username={username} setUsername={setUsername}
                                    email={email} setEmail={setEmail}
                                    password={password} setPassword={setPassword}
                                    handleSignUp={handleSignUp}
                                    loading={loading} error={error} success={success}
                                    direction={direction}
                                />
                            ) : (
                                <LoginForm
                                    email={email} setEmail={setEmail}
                                    password={password} setPassword={setPassword}
                                    handleLogin={handleLogin}
                                    loading={loading} error={error} success={success}
                                    direction={direction}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}