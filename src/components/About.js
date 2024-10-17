import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import git from '../assets/img/git.svg'
import react from '../assets/img/react.svg'
import java from '../assets/img/java.svg'
import javascript from '../assets/img/javascript.svg'
import python from '../assets/img/python.svg'
import spring from '../assets/img/spring.svg'
import mongodb from '../assets/img/mongodb.svg'
import nextjs from '../assets/img/nextjs.svg'
import nodejs from '../assets/img/nodejs.svg'

import about from '../assets/contents/about.json';

export const About = () => {
    const logos = [java, python, javascript, git, spring, mongodb, nextjs, nodejs, react]
    const responsive = {
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };
    return(
        <section id="about">
            <Container className="text-start">
                <Row>
                <div className="section-header">about</div>
                </Row>
                <Row className="d-flex justify-content-between">
                    <Col xs={12} md={12} xl={5}>
                        <Row>
                            <div className="pg-box">
                                <h2 className="pg-title">mathematics</h2>
                                <p className="paragraph">{about.mathematics}</p>
                            </div>
                        </Row>
                        <Row>
                            <div className="pg-box">
                                <h2 className="pg-title">education</h2>
                                <p className="paragraph">{about.education}</p>
                            </div>
                        </Row>
                    </Col>
                    <Col xs={12} md={12} xl={5}>
                        <Row>
                            <div className="pg-box">
                                <h2 className="pg-title">language acquistion</h2>
                                <p className="paragraph">{about.languageacquisition1}</p>
                                <p className="paragraph">{about.languageacquisition2}</p>
                            </div>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col className="skill-row">
                        <h2 className="pg-title">my skills</h2>
                        <div className="skill-box">
                            <Carousel className="skill-slider"
                            responsive={responsive} 
                            infinite={true} 
                            autoPlay={true} 
                            autoPlaySpeed={2000} 
                            swipeable={true} 
                            draggable={true}
                            ssr={true}
                            arrows={true}>
                                {logos.map((item, index) => (
                                    <div className="skill-item" key={index}><img src={item} alt="Logo" width={150}/></div>
                                ))}
                            </Carousel>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}