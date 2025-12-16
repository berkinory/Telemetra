'use client';

import { GithubIcon, ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useForm } from '@tanstack/react-form';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PixelBlast from '@/components/ui/pixelblast';
import { AutoHeight } from '@/components/ui/primitives/effects/auto-height';
import { Spinner } from '@/components/ui/spinner';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { authClient } from '@/lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginFormProps = {
  defaultValues?: {
    email: string;
    password: string;
  };
  onValuesChange?: (values: { email: string; password: string }) => void;
};

function LoginForm({ defaultValues, onValuesChange }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: defaultValues || {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        await authClient.signIn.email(
          {
            email: value.email,
            password: value.password,
            rememberMe: true,
            callbackURL: '/dashboard',
          },
          {
            onError: (ctx) => {
              toast.error(ctx.error.message || 'Invalid email or password');
            },
          }
        );
      } catch (error) {
        console.error('Login failed:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form
      aria-label="Login form"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Card>
        <CardContent className="space-y-3">
          <form.Subscribe selector={(state) => state.submissionAttempts}>
            {(submissionAttempts) => (
              <>
                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => {
                      const trimmedValue = value.trim();

                      if (!trimmedValue) {
                        return 'Email is required';
                      }

                      if (!EMAIL_REGEX.test(trimmedValue)) {
                        return 'Please enter a valid email address';
                      }

                      return;
                    },
                  }}
                >
                  {(field) => {
                    const showErrors =
                      submissionAttempts > 0 &&
                      field.state.meta.errors.length > 0;
                    return (
                      <div className="space-y-2">
                        <label
                          className="font-medium text-sm"
                          htmlFor="login-email"
                        >
                          Email
                        </label>
                        <Input
                          aria-describedby={
                            showErrors ? 'login-email-error' : undefined
                          }
                          aria-invalid={showErrors}
                          autoComplete="email"
                          autoFocus
                          id="login-email"
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            field.handleChange(event.target.value);
                            onValuesChange?.({
                              email: event.target.value,
                              password: form.state.values.password,
                            });
                          }}
                          placeholder="you@example.com"
                          type="text"
                          value={field.state.value}
                        />
                        <AutoHeight deps={[showErrors]}>
                          {showErrors && (
                            <p
                              className="text-destructive text-sm"
                              id="login-email-error"
                              role="alert"
                            >
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                        </AutoHeight>
                      </div>
                    );
                  }}
                </form.Field>

                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) {
                        return 'Password is required';
                      }

                      if (value.length < 8) {
                        return 'Password must be at least 8 characters';
                      }

                      if (value.length > 64) {
                        return 'Password must be at most 64 characters';
                      }

                      return;
                    },
                  }}
                >
                  {(field) => {
                    const showErrors =
                      submissionAttempts > 0 &&
                      field.state.meta.errors.length > 0;
                    return (
                      <div className="space-y-2">
                        <label
                          className="font-medium text-sm"
                          htmlFor="login-password"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <Input
                            aria-describedby={
                              showErrors ? 'login-password-error' : undefined
                            }
                            aria-invalid={showErrors}
                            autoComplete="current-password"
                            className="pr-10"
                            id="login-password"
                            onBlur={field.handleBlur}
                            onChange={(event) => {
                              field.handleChange(event.target.value);
                              onValuesChange?.({
                                email: form.state.values.email,
                                password: event.target.value,
                              });
                            }}
                            placeholder="••••••••"
                            type={showPassword ? 'text' : 'password'}
                            value={field.state.value}
                          />
                          <button
                            aria-label={
                              showPassword ? 'Hide password' : 'Show password'
                            }
                            className="absolute top-0 right-0 flex h-full items-center px-3"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                          >
                            <HugeiconsIcon
                              className="size-4 text-muted-foreground"
                              icon={showPassword ? ViewOffIcon : ViewIcon}
                            />
                          </button>
                        </div>
                        <AutoHeight deps={[showErrors]}>
                          {showErrors && (
                            <p
                              className="text-destructive text-sm"
                              id="login-password-error"
                              role="alert"
                            >
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                        </AutoHeight>
                      </div>
                    );
                  }}
                </form.Field>
              </>
            )}
          </form.Subscribe>

          <div className="flex justify-end">
            <button
              aria-label="Reset your password"
              className="text-primary text-sm hover:underline"
              onClick={() => {
                toast.info('Forgot password functionality coming soon');
              }}
              type="button"
            >
              Forgot Password?
            </button>
          </div>

          <form.Subscribe
            selector={(state) =>
              [
                state.canSubmit,
                state.isSubmitting,
                state.submissionAttempts,
              ] as const
            }
          >
            {([canSubmit, isSubmitting, submissionAttempts]) => (
              <Button
                className="w-full"
                disabled={
                  (submissionAttempts > 0 && !canSubmit) ||
                  isSubmitting ||
                  isLoading
                }
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Logging in
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            )}
          </form.Subscribe>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            aria-label="Sign in with Github"
            className="w-full"
            type="button"
            variant="outline"
          >
            <HugeiconsIcon className="mr-2 h-4 w-4" icon={GithubIcon} />
            Sign in with Github
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

type SignupFormProps = {
  defaultValues?: {
    name: string;
    email: string;
    password: string;
  };
  onValuesChange?: (values: {
    name: string;
    email: string;
    password: string;
  }) => void;
};

function SignupForm({ defaultValues, onValuesChange }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: defaultValues || {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        await authClient.signUp.email(
          {
            name: value.name,
            email: value.email,
            password: value.password,
            callbackURL: '/dashboard',
          },
          {
            onError: (ctx) => {
              toast.error(ctx.error.message || 'Could not create account');
            },
          }
        );
      } catch (error) {
        console.error('Signup failed:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form
      aria-label="Sign up form"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Card>
        <CardContent className="space-y-3">
          <form.Subscribe selector={(state) => state.submissionAttempts}>
            {(submissionAttempts) => (
              <>
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) => {
                      const trimmedValue = value.trim();

                      if (!trimmedValue) {
                        return 'Name is required';
                      }

                      if (trimmedValue.length < 2) {
                        return 'Name must be at least 2 characters';
                      }

                      if (trimmedValue.length > 14) {
                        return 'Name must be at most 14 characters';
                      }

                      return;
                    },
                  }}
                >
                  {(field) => {
                    const showErrors =
                      submissionAttempts > 0 &&
                      field.state.meta.errors.length > 0;
                    return (
                      <div className="space-y-2">
                        <label
                          className="font-medium text-sm"
                          htmlFor="signup-name"
                        >
                          Name
                        </label>
                        <Input
                          aria-describedby={
                            showErrors ? 'signup-name-error' : undefined
                          }
                          aria-invalid={showErrors}
                          autoComplete="name"
                          autoFocus
                          id="signup-name"
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            field.handleChange(event.target.value);
                            onValuesChange?.({
                              name: event.target.value,
                              email: form.state.values.email,
                              password: form.state.values.password,
                            });
                          }}
                          placeholder="John Doe"
                          type="text"
                          value={field.state.value}
                        />
                        <AutoHeight deps={[showErrors]}>
                          {showErrors && (
                            <p
                              className="text-destructive text-sm"
                              id="signup-name-error"
                              role="alert"
                            >
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                        </AutoHeight>
                      </div>
                    );
                  }}
                </form.Field>

                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => {
                      const trimmedValue = value.trim();

                      if (!trimmedValue) {
                        return 'Email is required';
                      }

                      if (!EMAIL_REGEX.test(trimmedValue)) {
                        return 'Please enter a valid email address';
                      }

                      return;
                    },
                  }}
                >
                  {(field) => {
                    const showErrors =
                      submissionAttempts > 0 &&
                      field.state.meta.errors.length > 0;
                    return (
                      <div className="space-y-2">
                        <label
                          className="font-medium text-sm"
                          htmlFor="signup-email"
                        >
                          Email
                        </label>
                        <Input
                          aria-describedby={
                            showErrors ? 'signup-email-error' : undefined
                          }
                          aria-invalid={showErrors}
                          autoComplete="email"
                          id="signup-email"
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            field.handleChange(event.target.value);
                            onValuesChange?.({
                              name: form.state.values.name,
                              email: event.target.value,
                              password: form.state.values.password,
                            });
                          }}
                          placeholder="you@example.com"
                          type="text"
                          value={field.state.value}
                        />
                        <AutoHeight deps={[showErrors]}>
                          {showErrors && (
                            <p
                              className="text-destructive text-sm"
                              id="signup-email-error"
                              role="alert"
                            >
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                        </AutoHeight>
                      </div>
                    );
                  }}
                </form.Field>

                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) {
                        return 'Password is required';
                      }

                      if (value.length < 8) {
                        return 'Password must be at least 8 characters';
                      }

                      if (value.length > 64) {
                        return 'Password must be at most 64 characters';
                      }

                      return;
                    },
                  }}
                >
                  {(field) => {
                    const showErrors =
                      submissionAttempts > 0 &&
                      field.state.meta.errors.length > 0;
                    return (
                      <div className="space-y-2">
                        <label
                          className="font-medium text-sm"
                          htmlFor="signup-password"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <Input
                            aria-describedby={
                              showErrors ? 'signup-password-error' : undefined
                            }
                            aria-invalid={showErrors}
                            autoComplete="new-password"
                            className="pr-10"
                            id="signup-password"
                            onBlur={field.handleBlur}
                            onChange={(event) => {
                              field.handleChange(event.target.value);
                              onValuesChange?.({
                                name: form.state.values.name,
                                email: form.state.values.email,
                                password: event.target.value,
                              });
                            }}
                            placeholder="••••••••"
                            type={showPassword ? 'text' : 'password'}
                            value={field.state.value}
                          />
                          <button
                            aria-label={
                              showPassword ? 'Hide password' : 'Show password'
                            }
                            className="absolute top-0 right-0 flex h-full items-center px-3"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                          >
                            <HugeiconsIcon
                              className="size-4 text-muted-foreground"
                              icon={showPassword ? ViewOffIcon : ViewIcon}
                            />
                          </button>
                        </div>
                        <AutoHeight deps={[showErrors]}>
                          {showErrors && (
                            <p
                              className="text-destructive text-sm"
                              id="signup-password-error"
                              role="alert"
                            >
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                        </AutoHeight>
                      </div>
                    );
                  }}
                </form.Field>
              </>
            )}
          </form.Subscribe>

          <form.Subscribe
            selector={(state) =>
              [
                state.canSubmit,
                state.isSubmitting,
                state.submissionAttempts,
              ] as const
            }
          >
            {([canSubmit, isSubmitting, submissionAttempts]) => (
              <Button
                className="w-full"
                disabled={
                  (submissionAttempts > 0 && !canSubmit) ||
                  isSubmitting ||
                  isLoading
                }
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Signing up
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            )}
          </form.Subscribe>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            aria-label="Sign up with Github"
            className="w-full"
            type="button"
            variant="outline"
          >
            <HugeiconsIcon className="mr-2 h-4 w-4" icon={GithubIcon} />
            Sign up with Github
          </Button>
        </CardContent>
      </Card>

      <p className="mt-2 px-3 text-center text-muted-foreground text-xs">
        By signing up you agree to{' '}
        <a
          className="underline hover:text-foreground"
          href="/terms"
          rel="noopener noreferrer"
          target="_blank"
        >
          Terms of Service
        </a>{' '}
        &{' '}
        <a
          className="underline hover:text-foreground"
          href="/privacy"
          rel="noopener noreferrer"
          target="_blank"
        >
          Privacy Policy
        </a>
      </p>
    </form>
  );
}

export default function AuthPage() {
  const [loginValues, setLoginValues] = useState({
    email: '',
    password: '',
  });

  const [signupValues, setSignupValues] = useState({
    name: '',
    email: '',
    password: '',
  });

  return (
    <div className="flex h-screen w-full">
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="fade-in slide-in-from-bottom-4 flex w-full max-w-md animate-in flex-col items-center gap-6 fill-mode-both px-8 delay-300 duration-700">
          <div className="flex flex-col items-center gap-4">
            <Image
              alt="Phase Logo"
              className="h-16 w-16"
              height={64}
              priority
              src="/logo.svg"
              width={64}
            />
            <h1 className="text-center font-semibold text-2xl">
              Welcome to Phase
            </h1>
          </div>

          <Tabs className="w-full" defaultValue="login">
            <TabsList className="w-full">
              <TabsTrigger className="flex-1" value="login">
                Login
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="signup">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContents>
              <TabsContent value="login">
                <LoginForm
                  defaultValues={loginValues}
                  onValuesChange={setLoginValues}
                />
              </TabsContent>

              <TabsContent value="signup">
                <SignupForm
                  defaultValues={signupValues}
                  onValuesChange={setSignupValues}
                />
              </TabsContent>
            </TabsContents>
          </Tabs>
        </div>
      </div>

      <div className="pointer-events-none fixed top-0 right-0 hidden h-screen w-[70%] lg:block">
        <div className="h-full w-full [mask-image:linear-gradient(to_right,black_35%,black_100%)]">
          <PixelBlast
            enableRipples={false}
            patternScale={5}
            pixelSize={3}
            speed={1}
          />
        </div>
      </div>
    </div>
  );
}
