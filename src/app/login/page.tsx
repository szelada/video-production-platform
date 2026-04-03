'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push('/workspace');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            {/* Left side: Cinematic branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#1C1C1E] relative overflow-hidden flex-col justify-end p-12 lg:p-24">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/10 xl:from-indigo-900/30 via-transparent to-transparent z-0" />

                {/* Subtle decorative circles */}
                <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-teal-500/10 blur-[120px] z-0" />
                <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px] z-0" />

                <div className="relative z-10 w-full mb-12">
                    <h1 className="text-white text-5xl lg:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
                        916 <br /><span className="text-zinc-500 font-light tracking-tight">PLATFORM</span>
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                        El sistema operativo definitivo para productoras audiovisuales. Administra castings, bases de locaciones, proveedores, reportes dinámicos y hojas de llamado, todo atado sincronizadamente a la ejecución integral del equipo a lo largo del globo terráqueo.
                    </p>
                </div>
            </div>

            {/* Right side: Login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#F8FAFC]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-12 lg:hidden text-center">
                        <h1 className="text-4xl font-black tracking-tighter text-zinc-900">
                            916 <span className="text-teal-500">PLATFORM</span>
                        </h1>
                    </div>

                    <h2 className="text-3xl font-black tracking-tighter text-zinc-900 mb-2">Bienvenido de Vuelta</h2>
                    <p className="text-zinc-500 mb-10 text-sm">Ingresa tus credenciales autorizadas por administración para acceder de manera remota al espacio de trabajo centralizado de las producciones.</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-start">
                                <div className="mr-3 mt-0.5">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                </div>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Correo Electrónico</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-zinc-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl text-zinc-900 transition-all outline-none font-medium"
                                        placeholder="nombre@916studio.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Contraseña de Acceso</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-zinc-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl text-zinc-900 transition-all outline-none font-medium font-mono"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-8 w-full py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_10px_40px_-10px_rgba(45,212,191,0.5)] focus:ring-4 focus:ring-teal-500/30 flex items-center justify-center disabled:opacity-70 disabled:shadow-none"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : 'Iniciar Sesión Asegurada'}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-xs text-zinc-400">¿No tienes cuenta? Contacta al Productor Ejecutivo para solicitar acceso inmediato al circuito.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
