"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

const UploadButton = () => {
  const [isopen, setIsopen] = useState(false);
  return (
    <Dialog
      open={isopen}
      onOpenChange={(v) => {
        if (!v) {
          setIsopen(v);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsopen(true)}>
        <Button>Upload Pdf</Button>
      </DialogTrigger>
      <DialogContent>Upload Here</DialogContent>
    </Dialog>
  );
};

export default UploadButton;
