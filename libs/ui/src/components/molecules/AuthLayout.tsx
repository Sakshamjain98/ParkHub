'use client'
import { CarScene } from '@ParkHub/3d/src/scenes/CarScene'
import { RotatingCamera } from '@ParkHub/3d/src/components/camera/Rotating'
import { IconArrowBack } from '@tabler/icons-react'
import Link from 'next/link'
import { ReactNode } from 'react'
import { BrandIcon } from '../atoms/BrandIcon'
import { GoogleButton } from './GoogleButton'

export interface IAuthLayoutProps {
  children: ReactNode
  title: string
}

export const AuthLayout = ({ title, children }: IAuthLayoutProps) => {
  return (
    <div className="relative left-1/2 right-1/2 h-[calc(100svh-4rem)] min-h-[calc(100vh-4rem)] w-screen -ml-[50vw] -mr-[50vw] overflow-hidden">
      <CarScene
        className="h-full w-full"
        orbitControls={false}
        camera={<RotatingCamera />}
        hideAllComments
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/20 bg-black/55 p-5 text-white shadow-2xl backdrop-blur-md sm:p-7">
          <h1 className="mb-1 flex items-center gap-2 text-2xl font-semibold">
            <BrandIcon />
            <span>{title}</span>
          </h1>
          <p className="mb-5 text-sm text-white/75">
            Access your account to continue.
          </p>

          {children}

          <div className="mt-6 border-t border-white/15 pt-4 text-sm text-white/80">
            <div className="mb-4 flex flex-col items-center">
              <div className="mb-2 text-xs uppercase tracking-wide text-white/65">
                Or continue with
              </div>
              <GoogleButton />
            </div>
            <Link href="/" className="mx-auto flex w-fit items-center gap-2 text-white/80 transition-colors hover:text-white">
              <IconArrowBack className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
