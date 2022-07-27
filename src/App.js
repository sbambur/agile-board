import { observer } from "mobx-react-lite";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
// import useStore from "./hooks/useStore";

function App() {
  return (
    <>
      <Header />
      <main>
        <Dashboard />
      </main>
    </>
  );
}

export default observer(App);
