import {Row, Col, Container, Image } from 'react-bootstrap';
import { SchoolWork } from "./SchoolWork";
import stroke1 from '../assets/img/stroke1.svg'
import stroke2 from '../assets/img/stroke2.svg'
import workschool from '../assets/contents/workschool.json';
import tudelft from '../assets/img/tudelft.png';
import staszic from '../assets/img/staszic.png';
import lanterna from '../assets/img/lanterna.png';

export const EducationWork = () => {
    const uni = workschool[0]
    const hs = workschool[1]
    const ta = workschool[2]
    const tut = workschool[3]
    return(
        <div className="education-work">
            <section id="education">
                <Container className="text-start">
                    <Row>
                    <div className="section-header">education</div>
                    </Row>
                    <Row>
                        <SchoolWork dates={uni.dates} title={uni.title} subtitle={uni.subtitle} feature={uni.feature} paragraph={uni.paragraph} imagepath={tudelft} imagelink={uni.imagelink} leftAligned={uni.leftAligned}/>
                    </Row>
                    <Row className="d-flex justify-content-center">
                        <Image src={stroke1} style={{width: '500px'}}/>
                    </Row>
                    <Row className="d-flex justify-content-end">
                        <SchoolWork dates={hs.dates} title={hs.title} subtitle={hs.subtitle} feature={hs.feature} paragraph={hs.paragraph} imagepath={staszic} imagelink={hs.imagelink} leftAligned={hs.leftAligned}/>
                    </Row>
                </Container>
            </section>
            <section id="work">
            <Container className="text-start">
                <Row>
                <div className="section-header">work</div>
                </Row>
                <Row>
                    <SchoolWork dates={ta.dates} title={ta.title} subtitle={ta.subtitle} feature={ta.feature} paragraph={ta.paragraph} imagepath={tudelft} imagelink={ta.imagelink} leftAligned={ta.leftAligned}/>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Image src={stroke2} style={{width: '500px'}}/>
                </Row>
                <Row className="d-flex justify-content-end">
                    <SchoolWork dates={tut.dates} title={tut.title} subtitle={tut.subtitle} feature={tut.feature} paragraph={tut.paragraph} imagepath={lanterna} imagelink={tut.imagelink} leftAligned={tut.leftAligned}/>
                </Row>
            </Container>
        </section>
    </div>
    )
}