
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, Database, Copy, ExternalLink } from 'lucide-react';
import { supabase, checkSupabaseTables } from '@/lib/supabase';
import { toast } from 'sonner';
import createTablesSQL from '@/utils/createTables.sql?raw';

export const DatabaseSetup = () => {
  const [isCheckingTables, setIsCheckingTables] = useState(false);
  const [tablesStatus, setTablesStatus] = useState<{
    allTablesExist: boolean;
    results?: Record<string, boolean>;
  } | null>(null);

  const handleCheckTables = async () => {
    setIsCheckingTables(true);
    try {
      const result = await checkSupabaseTables();
      setTablesStatus(result);
    } finally {
      setIsCheckingTables(false);
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(createTablesSQL);
    toast.success('SQL copied to clipboard');
  };

  const renderTableResults = () => {
    if (!tablesStatus?.results) return null;
    
    return (
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium">Table Status:</h4>
        {Object.entries(tablesStatus.results).map(([table, exists]) => (
          <div key={table} className="flex items-center justify-between text-sm">
            <span>{table}</span>
            {exists ? (
              <span className="text-green-500 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Exists
              </span>
            ) : (
              <span className="text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> Missing
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Supabase Database Setup
        </CardTitle>
        <CardDescription>
          Create the required tables in your Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Instructions</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCheckTables} 
              disabled={isCheckingTables}
            >
              {isCheckingTables ? 'Checking...' : 'Check Tables'}
            </Button>
          </div>
          
          {tablesStatus && (
            <Alert variant={tablesStatus.allTablesExist ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {tablesStatus.allTablesExist 
                  ? 'All tables exist' 
                  : 'Missing tables detected'}
              </AlertTitle>
              <AlertDescription>
                {tablesStatus.allTablesExist 
                  ? 'Your Supabase database is properly configured with all required tables.'
                  : 'Some required tables are missing in your Supabase database. Follow the steps below to create them.'}
              </AlertDescription>
              {renderTableResults()}
            </Alert>
          )}

          {(!tablesStatus || !tablesStatus.allTablesExist) && (
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>Go to your Supabase dashboard and select your project</li>
              <li>Navigate to the SQL Editor</li>
              <li>Create a new query</li>
              <li>Copy and paste the SQL below</li>
              <li>Run the query to create all required tables</li>
              <li>Return to this page and click "Check Tables" to verify</li>
            </ol>
          )}
        </div>

        {(!tablesStatus || !tablesStatus.allTablesExist) && (
          <>
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">SQL Commands</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopySQL}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy SQL
                </Button>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md overflow-auto max-h-[300px]">
                <pre className="text-xs whitespace-pre-wrap">{createTablesSQL}</pre>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.open('https://app.supabase.com', '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Supabase Dashboard
        </Button>
        
        <Button 
          variant="default" 
          onClick={handleCheckTables}
          disabled={isCheckingTables}
        >
          {isCheckingTables ? 'Checking...' : 'Check Tables'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseSetup;
