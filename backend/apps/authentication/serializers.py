from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserPostalAddress
import re

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password_confirm', 'first_name', 'last_name', 'phone')
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
            'phone': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'phone', 'date_joined')
        read_only_fields = ('id', 'date_joined')

    def validate_phone(self, value):
        """Validate Australian phone number format"""
        if not value:
            raise serializers.ValidationError("Phone number is required.")
        # Australian phone number pattern: +61XXXXXXXXX or 0XXXXXXXXX
        pattern = r'^(\+61|0)[2-478](?:[ -]?[0-9]){8}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                "Phone number must be in Australian format (+61XXXXXXXXX or 0XXXXXXXXX)"
            )
        return value


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user details"""
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'phone', 'email')
        extra_kwargs = {
            'email': {'required': False},
        }

    def validate_phone(self, value):
        """Validate Australian phone number format"""
        if value:
            pattern = r'^(\+61|0)[2-478](?:[ -]?[0-9]){8}$'
            if not re.match(pattern, value):
                raise serializers.ValidationError(
                    "Phone number must be in Australian format (+61XXXXXXXXX or 0XXXXXXXXX)"
                )
        return value


class UserPostalAddressSerializer(serializers.ModelSerializer):
    """Serializer for user postal address"""
    class Meta:
        model = UserPostalAddress
        fields = (
            'id', 'first_name', 'last_name', 'company', 'address_line_1',
            'address_line_2', 'city', 'province', 'country', 'postal_code',
            'phone', 'is_default', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
