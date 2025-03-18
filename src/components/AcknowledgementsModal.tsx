import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AcknowledgementsModal = ({ isOpen = false, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Acknowledgements
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-base">
          This project is only possible because of the hard work and time put in
          by Derek Marshal (legend of Eastern Cape Climbing) who was the first
          person to put together a climbing guide for Morgan Bay. Without his
          hard work and dedication to documenting climbing routes we would have
          nothing to work with. We are deeply thankful for his time and effort.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
export default AcknowledgementsModal;
