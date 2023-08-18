# Generated by Django 4.2.3 on 2023-08-17 14:21

import config.helpers
from django.db import migrations, models
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('transfer', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('transaction_id', django_extensions.db.fields.RandomCharField(blank=True, editable=False, include_alpha=False, length=15, unique=True, verbose_name='Transaction id')),
                ('transaction_slug', django_extensions.db.fields.AutoSlugField(blank=True, editable=False, null=True, populate_from='transfer_id', unique=True, verbose_name='Transaction slug value')),
                ('transaction_hash', models.CharField(max_length=100, verbose_name='Transaction hash')),
                ('transaction_from', models.CharField(max_length=100, validators=[config.helpers.validate_metamask_address], verbose_name='Transaction from account')),
                ('transaction_to', models.CharField(max_length=100, validators=[config.helpers.validate_metamask_address], verbose_name='Transaction to account')),
                ('transaction_amount', models.FloatField(blank=True, validators=[config.helpers.validate_amount], verbose_name='Transaction of transfer')),
                ('is_succsess', models.BooleanField(default=False, verbose_name='Is succsess')),
                ('confirmations', models.IntegerField(default=0, verbose_name='Confirmed transfer value')),
            ],
            options={
                'verbose_name': 'Transaction',
                'verbose_name_plural': 'Transactions',
            },
        ),
    ]