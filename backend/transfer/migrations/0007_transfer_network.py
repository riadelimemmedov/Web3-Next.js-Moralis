# Generated by Django 4.2.3 on 2023-08-18 13:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transfer', '0006_transfer_token_name_transfer_token_symbol'),
    ]

    operations = [
        migrations.AddField(
            model_name='transfer',
            name='network',
            field=models.CharField(max_length=50, null=True, verbose_name='Network name'),
        ),
    ]