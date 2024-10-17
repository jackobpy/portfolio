
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from './components/NavBar';
import { About } from './components/About';
import { NetBG } from './components/NetBG';
import { EducationWork } from './components/EducationWork';
import {Projects} from './components/Projects'
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <NetBG/>
      <About/>
      <EducationWork/>
      <Projects/>
      <Footer/>
    </div>
  );
}

export default App;
