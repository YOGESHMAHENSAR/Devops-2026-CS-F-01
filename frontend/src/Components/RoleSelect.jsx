import { Button , Typography, Card, CardContent} from "@mui/material";
import '../css/RoleSelect.css'

const ROLES = [
    {
        key: 'jobseeker',
        title: "I am Working Professional",
        description: "Looking for consultancy, mentorship, advisory or part-time work"
    },
    {
        key: 'recruiter',
        title: "I am a Recruiter",
        description: "Looking to hier Working Professional in to our Organisation"
    }
];

export default function RoleSelect({onSelect}){
    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <Typography variant="h5" color="primary.main">Welcome to SeniorPro</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tell us who you are to continue
            </Typography>
            <div className="roles">
                {ROLES.map((role) => (
                    <Button key={role.key} onClick={() => onSelect(role.key)} >
                        <Card sx={{ maxWidth: 340 }}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                {role.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {role.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Button>
                ))}
            </div>
        </div>
    )
}