import React from "react";
import { Badge } from "@/components/ui/badge";

const POSHeader = () => {
  return (
    <div className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-foreground">POS Terminal</h1>
          <p className="text-sm text-muted-foreground">Create new order</p>
        </div>
        <div className="hidden shrink-0 items-center space-x-2 sm:flex">
          <Badge variant="outline" className="text-xs">
            F1: Search | F2: Discount | F3: Customer | Ctrl+Enter: Payment
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default POSHeader;
