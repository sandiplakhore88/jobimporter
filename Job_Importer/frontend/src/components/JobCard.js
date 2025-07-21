'use client';
import { Card, Button } from 'react-bootstrap';

export default function JobCard({ job }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{job.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {job.company} — {job.location}
        </Card.Subtitle>
        <Card.Text>
          {job.description?.slice(0, 200)}...
        </Card.Text>
        <Button variant="primary" href={job.url} target="_blank">View Job</Button>
      </Card.Body>
    </Card>
  );
}