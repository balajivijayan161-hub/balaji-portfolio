import { NotAuthorised, VisitorDashboard } from "../components/AdminPage.jsx";
import { mockVisitors } from "./mockVisitors.js";

const MOCK_NOTICE =
  "Development preview. These rows are mock data for layout review. They are not real visitors, and this preview is left out of the production build.";

export default function AdminDevPreview({ kind }) {
  if (kind === "unauthorised") return <NotAuthorised email="someone.else@example.com" />;
  return <VisitorDashboard rows={mockVisitors} notice={MOCK_NOTICE} />;
}
