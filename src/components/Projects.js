import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import img2 from '../assets/img/website.png'
import img from '../assets/img/diff.png'
import img3 from '../assets/img/numja.png'
import img4 from '../assets/img/splitty.png'

export const Projects = () => {
    return (
        <section id="projects">
            <Container>
                <Row style={{marginBottom: '30px'}}>
                    <div className="section-header">projects</div>
                </Row>
                <Row xs={1} md={2} className="g-5" style={{marginTop: '30px'}}>
                    <Col style={{marginTop: '0px'}}>
                        <Card style={{marginBottom: '20px'}}>
                            <Card.Img variant="top" src={img2} />
                            <Card.Body>
                            <Card.Title style={{fontSize: '30px', fontWeight: '500'}}>Personal Website Portfolio</Card.Title>
                            <Card.Text style={{fontSize: '18px', fontWeight: '500'}}>
                                You are looking at it right now! I created this website from scratch as a way to document my experience, projects, and other stuff I feel like sharing. To complete this project I used React.
                            </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card style={{marginBottom: '20px'}}>
                            <Card.Img variant="top" src={img4} />
                            <Card.Body>
                            <Card.Title style={{fontSize: '30px', fontWeight: '500'}}>Splitty - Expense Management Application</Card.Title>
                            <Card.Text style={{fontSize: '18px', fontWeight: '500'}}>
                                I collaborated with 5 other students to build a full-stack Java desktop application for managing expenses, requesting payments, creating events, inviting people. We used technologies like MongoDB, JavaFX, Mockito, Spring Boot.
                            </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col style={{marginTop: '0px'}}>
                        <Card style={{marginBottom: '20px'}}>
                            <Card.Img variant="top" src={img} />
                            <Card.Body>
                            <Card.Title style={{fontSize: '30px', fontWeight: '500'}}>diff implementation in assembly</Card.Title>
                            <Card.Text style={{fontSize: '18px', fontWeight: '500'}}>
                            Together with another student we built an Assembly x86-64 version of ‘diff’ linux command, which compares two files line by line and shows all the differences between them.
                            </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card style={{marginBottom: '20px'}}>
                            <Card.Img variant="top" src={img3} />
                            <Card.Body>
                            <Card.Title style={{fontSize: '30px', fontWeight: '500'}}>numJa - numPy in Java</Card.Title>
                            <Card.Text style={{fontSize: '18px', fontWeight: '500'}}>
                                With a group of friends we are developing a Java library for performing operations on large, multi-dimensional arrays and matrices.
                            </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
      );
}