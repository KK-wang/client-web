import { useRoutes } from "react-router-dom"; 
 
import routesConfig from './router';

function App() {
  return useRoutes(routesConfig);
}

export default App;