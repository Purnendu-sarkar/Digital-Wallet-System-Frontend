/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserCheck, Mail, Smartphone, MapPin, Camera } from "lucide-react";

const fields = [
  { key: "name", label: "Full Name", icon: UserCheck },
  { key: "email", label: "Email", icon: Mail },
  { key: "phone", label: "Phone Number", icon: Smartphone },
  { key: "address", label: "Address", icon: MapPin },
  { key: "picture", label: "Profile Picture", icon: Camera },
];

const ProfileCompletionCard = memo(function ProfileCompletionCard({ user }: { user: any }) {
  const filledFields = fields.map((f) => ({ ...f, filled: !!user?.[f.key] }));
  const completedCount = filledFields.filter((f) => f.filled).length;
  const percentage = Math.round((completedCount / fields.length) * 100);

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-primary" />
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{percentage}%</span>
          <Badge variant={percentage === 100 ? "default" : "secondary"}>
            {completedCount}/{fields.length}
          </Badge>
        </div>
        <Progress value={percentage} className="h-2" />
        <div className="space-y-1.5">
          {filledFields.map((field) => (
            <div key={field.key} className="flex items-center gap-2 text-xs">
              <field.icon className={`w-3 h-3 ${field.filled ? "text-green-500" : "text-muted-foreground"}`} />
              <span className={field.filled ? "text-foreground" : "text-muted-foreground"}>{field.label}</span>
              {field.filled && <Badge variant="outline" className="ml-auto text-[10px] h-4 px-1">Done</Badge>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

export default ProfileCompletionCard;
