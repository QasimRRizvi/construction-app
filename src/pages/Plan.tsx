import AuthenticatedLayout from '../components/layouts/AuthenticatedLayout';
import PlanView from '../components/PlanView';

const Plan = () => {
  return (
    <AuthenticatedLayout>
      <PlanView />
    </AuthenticatedLayout>
  )
}

export default Plan;