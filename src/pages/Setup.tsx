
import { Layout, PageHeader } from '@/components/layout/Layout';
import DatabaseSetup from '@/components/setup/DatabaseSetup';

const Setup = () => {
  return (
    <Layout>
      <PageHeader 
        title="Database Setup" 
        subtitle="Configure your Supabase database and tables"
      />
      
      <div className="py-6">
        <DatabaseSetup />
      </div>
    </Layout>
  );
};

export default Setup;
