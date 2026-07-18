/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, ShieldAlert, Mail, Smartphone, Wallet } from "lucide-react";

const checks = [
  { label: "Email Verified", key: "isVerified", icon: Mail },
  { label: "Phone Added", key: "phone", icon: Smartphone },
  { label: "Account Active", key: "isActive", icon: ShieldCheck },
  { label: "Wallet Active", key: "wallet", icon: Wallet },
];

const SecurityStatusCard = memo(function SecurityStatusCard({ user }: { user: any }) {
  const results = checks.map((c) => {
    let passed: boolean;
    if (c.key === "isVerified") {
      passed = user?.isVerified;
    } else if (c.key === "phone") {
      passed = !!user?.phone;
    } else if (c.key === "isActive") {
      passed = user?.isActive === "ACTIVE";
    } else if (c.key === "wallet") {
      passed = !user?.wallet?.isBlocked;
    } else {
      passed = false;
    }
    return { ...c, passed };
  });
  const passedCount = results.filter((c) => c.passed).length;

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          Security Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${passedCount === results.length ? "bg-green-500/10" : "bg-amber-500/10"}`}>
            {passedCount === results.length ? (
              <ShieldCheck className="w-5 h-5 text-green-500" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {passedCount === results.length ? "All Secure" : "Needs Attention"}
            </p>
            <p className="text-xs text-muted-foreground">
              {passedCount}/{results.length} checks passed
            </p>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          {results.map((check) => (
            <div key={check.label} className="flex items-center gap-2 text-xs">
              <div className={`w-1.5 h-1.5 rounded-full ${check.passed ? "bg-green-500" : "bg-amber-500"}`} />
              <check.icon className={`w-3 h-3 ${check.passed ? "text-green-500" : "text-muted-foreground"}`} />
              <span className={check.passed ? "text-foreground" : "text-muted-foreground"}>{check.label}</span>
              <Badge
                variant={check.passed ? "default" : "outline"}
                className={`ml-auto text-[10px] h-4 px-1 ${check.passed ? "" : "text-amber-500 border-amber-500"}`}
              >
                {check.passed ? "Passed" : "Pending"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

export default SecurityStatusCard;
