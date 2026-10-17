import PageContainer from '../components/PageContainer';
import { EmptyState } from '../components/StateMessage';

export default function NotFound() {
  return (
    <PageContainer title="Page not found">
      <EmptyState title="This page does not exist" message="The link may be broken or the page may have moved." actionLabel="Go to Home" to="/" />
    </PageContainer>
  );
}
