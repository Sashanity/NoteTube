import React from 'react';
import { Footer,FooterLinkList,FooterDropDownSection,FooterSection} from 'react-mdl';
import { Link } from 'react-router-dom';


const footer= () => {
    return (
<Footer size="mega">
    <FooterSection type="middle">
        <FooterDropDownSection title="Features">
            <FooterLinkList>
                <Link to="#">About</Link>
                <Link to="#">Terms</Link>
                <Link to="#">Partner</Link>
                <Link to="#">Updates</Link>
            </FooterLinkList>
        </FooterDropDownSection>
        <FooterDropDownSection title="Details">
            <FooterLinkList>
            <Link to="#">About</Link>
                <Link to="#">Terms</Link>
                <Link to="#">Partner</Link>
                <Link to="#">Updates</Link>
            </FooterLinkList>
        </FooterDropDownSection>
        <FooterDropDownSection title="Technology">
            <FooterLinkList>
            <Link to="#">About</Link>
                <Link to="#">Terms</Link>
                <Link to="#">Partner</Link>
                <Link to="#">Updates</Link>
            </FooterLinkList>
        </FooterDropDownSection>
        <FooterDropDownSection title="FAQ">
            <FooterLinkList>
            <Link to="#">About</Link>
                <Link to="#">Terms</Link>
                <Link to="#">Partner</Link>
                <Link to="#">Updates</Link>
            </FooterLinkList>
        </FooterDropDownSection>
    </FooterSection>

</Footer>



    )
    }
    export default footer