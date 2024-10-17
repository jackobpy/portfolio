import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/img/logo.svg';
import { GithubOutlined, LinkedinFilled, MailOutlined } from '@ant-design/icons';

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveLink(sectionId);
        }
      });
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  };

  return (
    <Navbar expand="lg" className={scrolled ? 'scrolled' : ''}>
      <Container>
        <Navbar.Brand href="#home">
          <img src={logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" className={activeLink === 'home' ? 'active-navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>home</Nav.Link>
            <Nav.Link href="#about" className={activeLink === 'about' ? 'active-navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('about')}>about</Nav.Link>
            <Nav.Link href="#education" className={activeLink === 'education' ? 'active-navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('education')}>education</Nav.Link>
            <Nav.Link href="#work" className={activeLink === 'work' ? 'active-navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('work')}>work</Nav.Link>
            <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active-navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>projects</Nav.Link>
          </Nav>
          <span className="navbar-text">
            <div className="social-icon">
              <a href="https://github.com/jackobpy"><GithubOutlined style={{ color: '#D8D8D8' }} /></a>
              <a href="https://www.linkedin.com/in/jakubfrechowicz/"><LinkedinFilled style={{ color: '#D8D8D8' }} /></a>
              <a href="mailto:jakub.frechowicz@gmail.com"><MailOutlined style={{ color: '#D8D8D8' }} /></a>
            </div>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
