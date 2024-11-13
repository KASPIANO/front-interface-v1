import { Box, Grid, Typography, Avatar, IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

// Team member data
const teamMembers = [
    {
        name: 'Sione Milhem',
        position: 'Founder & CEO',
        image: 'https://krc20data.s3.amazonaws.com/verified/sione.jpg', // Replace with actual image URL
        description:
            "Sione is an entrepreneur and computer scientist with deep expertise in blockchain technology. A member of the Kaspa community since 2022, Sione has been involved in every aspect of Kaspiano's development, from ideation to launch.",
        twitter: 'https://x.com/cryptosione',
        linkedIn: 'https://www.linkedin.com/in/sione-milhem/',
    },
    {
        name: 'Avidan Abitbol',
        position: 'Co-Founder & Development Lead',
        image: 'https://krc20data.s3.amazonaws.com/verified/avidan.jpg', // Replace with actual image URL
        description:
            'Avidan is a seasoned member of the Kaspa community with extensive experience in management and business development. As co-founder of Kaspiano, he leads the development efforts, overseeing architecture and aligning technical execution with company goals.',
        twitter: 'https://x.com/avidanab',
    },
    {
        name: 'Gilad',
        position: 'Senior Full Stack Developer',
        image: 'https://krc20data.s3.amazonaws.com/verified/gilad.png', // Replace with actual image URL
        description:
            "Gilad is a highly skilled Full Stack Developer, focusing on backend development and contributing to Kaspiano's success, including Rug Score calculations and Kaspa blockchain integration.",
        twitter: 'https://x.com/giladkas',
    },
    {
        name: 'Abraham Milhem',
        position: 'Community, Partnerships, & Social Media Manager',
        image: 'https://krc20data.s3.amazonaws.com/verified/abi.jpeg', // Replace with actual image URL
        description:
            'Abraham excels at building engaged communities in the crypto space, focusing on keeping Kaspiano transparent and community-driven, ensuring all feedback is heard and addressed.',
        twitter: 'https://x.com/BabyKrakennn',
        linkedIn: 'https://www.linkedin.com/in/abrahammilhem/',
    },
    {
        name: 'Itamar Amith',
        position: 'Devops Engineer',
        image: 'https://krc20data.s3.us-east-1.amazonaws.com/verified/WhatsApp+Image+2024-11-12+at+12.43.00.jpeg', // Replace with actual image URL
        description:
            "Itamar brings to the team over a decade of experience designing and building backend systems for businesses across a variety of industries. His first commercial experience with Blockchain was as the chief architect at Illuvium, and he's looking forward to staying in the forefront of web3 technology with Kaspiano",
        twitter: 'https://x.com/itabot',
        linkedIn: 'https://au.linkedin.com/in/itamaramith',
    },
    {
        name: 'Dor Zion',
        position: 'Founder',
        image: 'https://krc20data.s3.amazonaws.com/verified/dorzi.png', // Replace with actual image URL
        description:
            'Dor began his career in the Israeli military’s elite tech units and played a key role in system architecture and development across various startups and corporations.',
        twitter: 'https://x.com/zion_dor',
    },
    {
        name: 'Ben Brizovsky',
        position: 'Senior Developer',
        image: 'https://krc20data.s3.amazonaws.com/verified/benbo.png', // Replace with actual image URL
        description:
            "With a passion for development, Ben has been instrumental in building Kaspiano's back-end infrastructure and API, integrating key data with MongoDB.",
    },
    {
        name: 'Arnon',
        position: 'Senior Software Engineer',
        image: 'https://krc20data.s3.amazonaws.com/verified/arnon.png', // Replace with actual image URL
        description:
            "Arnon specializes in back-end infrastructure, DevOps, and workflow automation, ensuring that Kaspiano's system can scale efficiently while remaining performant.",
        twitter: 'https://x.com/ArnonHillel',
    },
    {
        name: 'Tomer',
        position: 'Software Engineer',
        image: 'https://krc20data.s3.us-east-1.amazonaws.com/verified/1ad8a15a4e5608aca594888c3a6a59f38d7cdf80e18c2587f795658b2e621b95i0.png', // Replace with actual image URL
        description:
            'Tomer is a full-stack developer with a strong passion for back-end development, specializing in workflow automation, ETL processes, API integrations, and database management.',
    },
];

const TeamPage = () => (
    <Box sx={{ padding: '2rem' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Meet the Team - Kaspiano
        </Typography>
        <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} key={index}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: '1rem',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                        }}
                    >
                        {/* Team Member Image */}
                        <Avatar
                            src={member.image}
                            alt={member.name}
                            sx={{ width: '120px', height: '120px', marginBottom: '1rem' }}
                        />

                        {/* Team Member Name & Position */}
                        <Typography variant="h6" gutterBottom>
                            {member.name}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom color="textSecondary">
                            {member.position}
                        </Typography>

                        {/* Team Member Description */}
                        <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
                            {member.description}
                        </Typography>

                        {/* Social Media Links */}
                        <Box>
                            {member.twitter && (
                                <IconButton
                                    aria-label="Twitter"
                                    component="a"
                                    href={member.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: '#1DA1F2' }} // Twitter blue color
                                >
                                    <TwitterIcon />
                                </IconButton>
                            )}
                            {member.linkedIn && (
                                <IconButton
                                    aria-label="LinkedIn"
                                    component="a"
                                    href={member.linkedIn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: '#0077B5' }} // LinkedIn blue color
                                >
                                    <LinkedInIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Box>
);

export default TeamPage;
