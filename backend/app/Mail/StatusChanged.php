<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StatusChanged extends Mailable
{
    use Queueable, SerializesModels;

    protected $report;

    protected $oldStatus;

    protected function getStatusText($statusInt) {
        switch ($statusInt) {
          case 0:
            return "unresolved";
          case 1:
            return "resolved";
          case 2:
            return "in progress";
          case 3:
            return "dropped";
          default:
            return "unresolved";
        }
      }

    /**
     * Create a new message instance.
     */
    public function __construct($report, $oldStatus)
    {
        $this->report = $report;
        $this->oldStatus = $oldStatus;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Malfunction Report Status Changed'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.status_changed',
            with: [
                'description' => $this->report->description,
                'created_at' => $this->report->created_at,
                'newStatus' => $this->getStatusText($this->report->status),
                'oldStatus' => $this->getStatusText($this->oldStatus)
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
