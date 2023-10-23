import Board from "../../../../components/Board";
import Header from "../../../../components/Header";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <main>
      {/* Header */}
      <Header />
      {/* Board */}
      <Board />
      {/* Toast */}
      <Toaster position="top-right" />
    </main>
  );
}
