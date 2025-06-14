
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReactNode } from 'react';

interface ModernCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: ReactNode;
  className?: string;
}

const ModernCard = ({ 
  title, 
  description, 
  icon, 
  badge, 
  badgeVariant = 'default',
  children, 
  className = '' 
}: ModernCardProps) => {
  return (
    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/20 ${className}`}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3 text-xl">
            {icon && (
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <span>{title}</span>
          </CardTitle>
          {badge && (
            <Badge variant={badgeVariant} className="px-3 py-1">
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default ModernCard;
