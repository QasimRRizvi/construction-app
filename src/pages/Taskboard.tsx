import AuthenticatedLayout from '../components/layouts/AuthenticatedLayout';
import TaskboardView from '../components/TaskboardView';

const Taskboard = () => {
  return (
    <AuthenticatedLayout>
      <TaskboardView />
    </AuthenticatedLayout>
  );
};

export default Taskboard;
