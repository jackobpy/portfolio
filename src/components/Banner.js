import React, { useCallback, useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';

export const Banner = () => {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(200);
    const [blinking, setBlinking] = useState(false);
    const period = 3000;
    const cursorElementRef = useRef(null);

    const tick = useCallback(() => {
        const toRotate = ["BSc CSE Student", "IB Math tutor", "9th best CS/Math Student in NL", "Teaching Assistant", "Aspiring Software Engineer"]
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? (text.length === 1 ? '\u00A0' : fullText.substring(0, text.length - 1)) : (text === '\u00A0' ? fullText.substring(0,1) : fullText.substring(0, text.length + 1))
        setText(updatedText);
        if (isDeleting && delta === 3000){
            setDelta(500);
            setBlinking(false);
        } else if (isDeleting){
            setDelta(prevDelta => prevDelta < 63 ? 62: prevDelta/2);
        }

        if (!isDeleting && updatedText === fullText){
            setIsDeleting(true);
            setBlinking(true);
            setDelta(period);
        } else if (isDeleting && updatedText === '\u00A0'){
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setDelta(150); //typing speed
        }
    }, [loopNum, isDeleting, text, delta])

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        }, delta)

        return () => {
            clearInterval(ticker);
        }
    }, [tick, delta])

    useEffect(() => {
        if (cursorElementRef.current) {
            if (blinking) {
                cursorElementRef.current.classList.add('blinking');
            } else {
                cursorElementRef.current.classList.remove('blinking');
            }
        }
    }, [blinking]);

    return (
    <section className="banner" id="home">
        <Container>
            <Row className="align-items-center pb-5">
                <Col className="text-start">
                <span className="hello">
                    Hello, my name is
                </span>
                <h1 className="header">{'Jakub Fręchowicz'}</h1>
                <div className="wrap-container">
                    <p className='wrap'>
                        {text}
                        <span className={`cursor ${blinking ? 'blinking' : ''}`}>|</span>
                    </p>
                </div>
                <div className='hireme-container'>
                    <button className='hireme' onClick={() => {console.log('hire me')}}> hire me</button>
                    <div className='hiremebg'></div>
                </div>
                </Col>
            </Row>
            <Row>
                <Col className="text-start">
                    <div class="scroll-indicator">
                        <span>scroll</span>
                        <div class="scroll-line"></div>
                    </div>
                </Col>
            </Row>
        </Container>
    </section>
  )
}