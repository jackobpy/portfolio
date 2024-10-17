import {Row, Col, Image } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';

export const SchoolWork = ({dates, title, subtitle, feature, paragraph, imagepath, imagelink, leftAligned}) => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
      });
    return(
    <div className={(leftAligned ? 'school-work school-work-left' : 'school-work school-work-right') + (inView ? ' fade-in-container' : '')} ref={ref}>
        <Row>
            <Col md={4} className={leftAligned ? 'order-md-1' : 'order-md-2'} style={leftAligned ? {} : { display: 'flex', justifyContent: 'flex-end' }}>
            <div class="image-wrapper">
                <a href={imagelink} target="_blank" rel="noopener noreferrer">
                    <Image 
                        src={imagepath} 
                        fluid
                        className='logo'
                    />
                </a>
            </div>
            </Col>
            <Col md={8} className={leftAligned ? 'order-md-2' : 'order-md-1'}>
            <div>
                <p className='dates'>{dates}</p>
                <p className='title'>{title}</p>
                <p className='subtitle'>{subtitle}</p>
                {feature && <p className='feature'>{feature}</p>}
                <p className='paragraph'>
                {paragraph}
                </p>
            </div>
            </Col>
        </Row>
    </div>
    )
}