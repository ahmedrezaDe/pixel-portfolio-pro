import { AnimatePresence } from "motion/react";
import { SubspaceTransmission } from "@/components/SubspaceTransmission";

export function ContactView({ onClose }: { onClose?: () => void }) {
  return (
    <div className="min-h-screen bg-black">
      <AnimatePresence>
        <SubspaceTransmission 
          mode="contact" 
          onClose={() => {
            // If your parent component passes an onClose prop, use it.
            // Otherwise, we force the browser to go back to the home state.
            if (onClose) {
              onClose();
            } else {
              window.location.href = '/'; 
            }
          }} 
        />
      </AnimatePresence>
    </div>
  );
}