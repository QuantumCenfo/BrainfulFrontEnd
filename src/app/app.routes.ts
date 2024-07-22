import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/auth/login/login.component";
import { AppLayoutComponent } from "./components/app-layout/app-layout.component";
import { SigUpComponent } from "./pages/auth/sign-up/signup.component";
import { UsersComponent } from "./pages/users/users.component";
import { AuthGuard } from "./guards/auth.guard";
import { AccessDeniedComponent } from "./pages/access-denied/access-denied.component";
import { AdminRoleGuard } from "./guards/admin-role.guard";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { GuestGuard } from "./guards/guest.guard";
import { IRole } from "./interfaces";
import { ChallengesComponent } from "./pages/challenges/challenges.component";
import { BadgesComponent } from "./pages/badges/badges.component";
import { ContentsComponent } from "./pages/contents/contents.component";
import { BadgesUsersComponent } from "./pages/badges-users/badges-users.component";

import { ForumsComponent } from "./pages/forums/forums.component";
import { RemindersComponent } from "./pages/reminders/reminders.component";
import { GamesComponent } from "./pages/games/games.component";
import { FormComponent } from "./pages/form/form.component";
import { ContentsUsersComponent } from "./pages/contents-users/contents-users.component";
import { ChallengesUsersComponent } from "./pages/challenges-users/challenges-users.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { MemoryBoardComponent } from "./components/memory-board/memory-board.component";
import { SequenceGameComponent } from "./components/sequence-game/sequence-game.component";
import { ReactionGameComponent } from "./components/reaction-game/reaction-game.component";
import { PuzzleComponent } from "./components/puzzle-game/puzzle-game.component";
import { QuantumLandingComponent } from "./quantum-landing/quantum-landing.component";
import { BarinfulLandingComponent } from "./pages/Brainful/barinful-landing/barinful-landing.component";
import { RecomendationsComponent } from "./pages/recomendations/recomendations.component";
import { ParticipationsComponent } from "./pages/participations/participations.component";

export const routes: Routes = [
  {
    path: "",
    component: QuantumLandingComponent,
    data: {
      authorities: [IRole.superAdmin, IRole.user],
    },
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "brainful",
    component: BarinfulLandingComponent,
    data: {
      authorities: [IRole.superAdmin, IRole.user],
    },
  },
  {
    path: "signup",
    component: SigUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "access-denied",
    component: AccessDeniedComponent,
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "app",
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "app",
        redirectTo: "users",
        pathMatch: "full",
      },
      {
        path: "users",
        component: UsersComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [IRole.superAdmin],
          name: "Users",
          showInSidebar: true,
        },
      },
      // {
      //   path: 'dashboard',
      //   component: DashboardComponent,
      //   data: { authorities: [
      //       IRole.superAdmin,
      //       IRole.user
      //     ],
      //     name: 'Dashboard'
      //   }
      // },
      {
        path: "challenges",
        component: ChallengesComponent,
        data: {
          authorities: [IRole.superAdmin],
          name: "Desafios",
          showInSidebar: true,
        },
      },
      {
        path: "badges",
        component: BadgesComponent,
        data: {
          authorities: [IRole.superAdmin],
          name: "Insignias",
          showInSidebar: true,
        },
      },
      {
        path: "contents",
        component: ContentsComponent,
        data: {
          authorities: [IRole.superAdmin],
          name: "Contenido Educativo",
          showInSidebar: true,
        },
      },
      {
        path: "badges-users",
        component: BadgesUsersComponent,
        data: {
          authorities: [IRole.user],
          name: "Insignias",
          showInSidebar: true,
        },
      },
      
      {
        path: "forums",
        component: ForumsComponent,
        data: { authorities: [IRole.user], name: "Foros", showInSidebar: true },
      },
      {
        path: "reminders",
        component: RemindersComponent,
        data: {
          authorities: [IRole.user],
          name: "Recordatorios",
          showInSidebar: true,
        },
      },
      {
        path: "games",
        component: GamesComponent,
        data: {
          authorities: [IRole.user],

          name: "Juegos",
          showInSidebar: true,
        },
      },
      {
        path: "participationsOutdoor",
        component: ParticipationsComponent,
        data: {
          authorities: [IRole.superAdmin],

          name: "Participaciones",
          showInSidebar: true,
        },
      },
      {
        path: "recomendations",
        component: RecomendationsComponent,
        data: {
          authorities: [IRole.user],
          name: "Recomendaciones",
          showInSidebar: true,
        },
      },
      {
        path: "form",
        component: FormComponent,
        data: {
          authorities: [IRole.user],
          name: "Questionario",
          showInSidebar: true,
        },
      },
      {
        path: "contents-user",
        component: ContentsUsersComponent,
        data: {
          authorities: [IRole.user],
          name: "ContenidoEducativo",
          showInSidebar: true,
        },
      },
      {
        path: "habits",
        component: ContentsUsersComponent,
        data: {
          authorities: [IRole.user],
          name: "Habitos",
          showInSidebar: true,
        },
      },
      {
        path: "challenges-users",
        component: ChallengesUsersComponent,
        data: {
          authorities: [IRole.user],
          name: "Desafios",
          showInSidebar: true,
        },
      },
      {
        path: "profile",
        component: ProfileComponent,
        data: {
          authorities: [IRole.superAdmin, IRole.user],
          name: "profile",
          showInSidebar: false,
        },
      },
      {
        path: "memory-game",
        component: MemoryBoardComponent,
        data: {
          authorities: [IRole.superAdmin, IRole.user],
          
        },
      },
      {
        path: "sequence-game",
        component: SequenceGameComponent,
        data: {
          authorities: [IRole.superAdmin, IRole.user],
          
        },
       
      },
      {
        path: "puzzle-game",
        component: PuzzleComponent,
        data: {
          authorities: [IRole.superAdmin, IRole.user],
          
        },
       
      },
      {
        path: "reaction-game",
        component: ReactionGameComponent,
        data: {
          authorities: [IRole.superAdmin, IRole.user],
          
        },
      },
      
    ],
  },
];
