import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { Zap, Shield, Globe, ArrowRight } from "lucide-react";

export const HeroPage = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] translate-y-1/2" />

      <div className="container relative z-10 px-4 py-24 mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium border rounded-full bg-muted/50 border-border text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Zap size={14} className="fill-primary" />
          <span className="tracking-tight">Next-Gen Real-time Messaging</span>
        </div>

        <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/60 animate-in fade-in slide-in-from-bottom-6 duration-1000">

          Connect beyond <br />
          <span className="text-primary italic">boundaries.</span>
        </h1>

        <p className="max-w-2xl mx-auto mb-10 text-lg md:text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000">
          SteamChat provides a seamless, secure, and lightning-fast experience for teams and individuals to stay connected anywhere in the world.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 group" asChild>
            <Link to="/chatPage">
              Start Chatting
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold rounded-2xl border-2 hover:bg-muted/50 transition-all border-border" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-8 mt-24 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="p-8 border rounded-3xl bg-card border-border hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 mb-4 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <h3 className="mb-2 text-xl font-bold">Real-time Speed</h3>
            <p className="text-muted-foreground text-sm">Experience zero-latency messaging with our cutting-edge WebSocket infrastructure.</p>
          </div>
          <div className="p-8 border rounded-3xl bg-card border-border hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 mb-4 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <h3 className="mb-2 text-xl font-bold">End-to-End Secure</h3>
            <p className="text-muted-foreground text-sm">Your privacy is our priority. Every message is encrypted before it leaves your device.</p>
          </div>
          <div className="p-8 border rounded-3xl bg-card border-border hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 mb-4 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Globe size={24} />
            </div>
            <h3 className="mb-2 text-xl font-bold">Global Presence</h3>
            <p className="text-muted-foreground text-sm">Chat across borders with automatic translation and multi-region support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

