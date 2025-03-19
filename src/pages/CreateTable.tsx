
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTable } from '@/api/tableService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const tableSchema = z.object({
  name: z.string().min(1, 'Table name is required'),
  capacity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Capacity must be a positive number',
  }),
  positionX: z.string().refine((val) => !isNaN(Number(val)), {
    message: 'Position X must be a number',
  }),
  positionY: z.string().refine((val) => !isNaN(Number(val)), {
    message: 'Position Y must be a number',
  }),
});

type TableFormValues = z.infer<typeof tableSchema>;

const CreateTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentCafe } = useAuth();

  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      name: '',
      capacity: '4',
      positionX: '0',
      positionY: '0',
    },
  });

  const onSubmit = async (values: TableFormValues) => {
    if (!currentCafe) return;
    
    setIsLoading(true);
    try {
      await createTable({
        name: values.name,
        capacity: Number(values.capacity),
        positionX: Number(values.positionX),
        positionY: Number(values.positionY),
        status: 'available',
        cafe_id: currentCafe.id
      });
      
      toast.success('Table created successfully!');
      navigate('/tables');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create table');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Create New Table">
      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Name/Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Table 1, Booth A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seating Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="positionX"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position X</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="positionY"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Y</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/tables')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Table'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default CreateTable;
