import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { ConceptsPage } from "@/pages/ConceptsPage";
import { VisualDemoPage } from "@/pages/VisualDemoPage";
import { MacroinstructionsPage } from "@/pages/MacroinstructionsPage";
import { MultiplicationExamplePage } from "@/pages/MultiplicationExamplePage";
import { ExercisesPage } from "@/pages/ExercisesPage";
import { SummaryPage } from "@/pages/SummaryPage";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/concepts" element={<ConceptsPage />} />
        <Route path="/visual-demo" element={<VisualDemoPage />} />
        <Route path="/macroinstructions" element={<MacroinstructionsPage />} />
        <Route path="/examples/multiplication" element={<MultiplicationExamplePage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Route>
    </Routes>
  );
};

export default App;
