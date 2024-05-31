@component('mail::message')
# Report Status Update

We wanted to inform you that the status of your report has changed.
@component('mail::table')
| Report Description | Previous Status | Current Status | 
| :--: |:----:| :-----:| 
| {{ $description }}  | {{ $oldStatus }} | {{ $newStatus }} |
@endcomponent

If you have any questions or need further assistance, please feel free to contact us. 
Best regards,
{{ config('app.name') }} Team
@endcomponent